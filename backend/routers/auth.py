from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy.orm import Session

try:
    from database import get_db
    from models import User
    from schemas import UserCreate, UserLogin, UserResponse, LoginResponse, MessageResponse
    from auth import hash_password, verify_password, create_access_token, verify_access_token
except ImportError:
    from backend.database import get_db
    from backend.models import User
    from backend.schemas import UserCreate, UserLogin, UserResponse, LoginResponse, MessageResponse
    from backend.auth import hash_password, verify_password, create_access_token, verify_access_token

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def signup(user_in: UserCreate, db: Session = Depends(get_db)):
    # Check duplicate email
    existing_email = db.query(User).filter(User.email == user_in.email).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email address is already registered"
        )

    # Check duplicate phone
    existing_phone = db.query(User).filter(User.phone == user_in.phone).first()
    if existing_phone:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Phone number is already registered"
        )

    hashed_pwd = hash_password(user_in.password)
    new_user = User(
        name=user_in.name,
        phone=user_in.phone,
        email=user_in.email,
        password_hash=hashed_pwd
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login", response_model=LoginResponse, status_code=status.HTTP_200_OK)
def login(login_in: UserLogin, request: Request, response: Response, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_in.email).first()
    if not user or not verify_password(login_in.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Create JWT Token
    token_data = {"sub": str(user.id), "email": user.email}
    access_token = create_access_token(data=token_data)

    # Auto-detect HTTPS for secure cookie on Render
    is_https = request.url.scheme == "https" or request.headers.get("x-forwarded-proto") == "https"

    # Set HttpOnly Cookie
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        max_age=3600,
        samesite="lax",
        secure=is_https,
        path="/"
    )

    return LoginResponse(
        message="Login successful",
        user=UserResponse.model_validate(user)
    )

@router.get("/me", response_model=UserResponse, status_code=status.HTTP_200_OK)
def get_current_user(request: Request, db: Session = Depends(get_db)):
    token = request.cookies.get("access_token")
    if not token:
        # Fallback to Authorization Header
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )

    payload = verify_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired session token"
        )

    user_id = int(payload["sub"])
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User no longer exists"
        )

    return user

@router.post("/logout", response_model=MessageResponse, status_code=status.HTTP_200_OK)
def logout(response: Response):
    response.delete_cookie(key="access_token", path="/", httponly=True, samesite="lax")
    return MessageResponse(message="Logout successful")
