import re
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, field_validator, model_validator

class UserCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255, description="Full Name")
    phone: str = Field(..., min_length=7, max_length=20, description="Phone Number")
    email: EmailStr = Field(..., description="Email Address")
    password: str = Field(..., min_length=8, description="Password")
    confirm_password: str = Field(..., description="Confirm Password")

    @field_validator("name")

    def name_must_not_be_empty(cls, v: str) -> str:
        v_stripped = v.strip()
        if not v_stripped:
            raise ValueError("Full Name cannot be empty")
        return v_stripped

    @field_validator("phone")

    def phone_validation(cls, v: str) -> str:
        v_clean = v.strip()
        # Accept numeric digits, optional leading +, optional dashes/spaces
        digits_only = re.sub(r"[\s\-\(\)\+]", "", v_clean)
        if not digits_only.isdigit() or len(digits_only) < 7 or len(digits_only) > 15:
            raise ValueError("Phone number must contain between 7 and 15 digits")
        return v_clean

    @field_validator("password")

    def password_security(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")
        if not re.search(r"[A-Za-z]", v):
            raise ValueError("Password must contain at least one letter")
        if not re.search(r"\d", v):
            raise ValueError("Password must contain at least one number")
        return v

    @model_validator(mode="after")
    def passwords_match(self) -> "UserCreate":
        if self.password != self.confirm_password:
            raise ValueError("Confirm Password does not match Password")
        return self

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    phone: str
    email: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class LoginResponse(BaseModel):
    message: str
    user: UserResponse

class MessageResponse(BaseModel):
    message: str
