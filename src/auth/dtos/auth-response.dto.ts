export class LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    username: string;
    email: string;
    profilePicture?: string;
  };
  expiresIn: number; // seconds until token expires
}

export class RefreshTokenDto {
  refreshToken: string;
}

export class LogoutResponseDto {
  message: string;
  success: boolean;
}
