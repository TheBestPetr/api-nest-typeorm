import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UnauthorizedException,
  UseGuards,
  Request,
  Response,
} from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { BearerAuthGuard } from '../../../infrastructure/guards/bearer.auth.guard';
import {
  AuthInputEmailConfirmationDto,
  AuthInputEmailPasswordRecoveryDto,
  AuthInputEmailResendingDto,
  AuthInputLoginDto,
  AuthInputNewPasswordDto,
  AuthInputRegistrationDto,
} from './dto/input/auth.input.dto';
import { UsersQueryRepo } from '../../users/infrastructure/typeorm/users.query.repo';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersQueryRepo: UsersQueryRepo,
  ) {}

  @UseGuards(ThrottlerGuard)
  @Post('registration')
  @HttpCode(204)
  async userRegistration(@Body() userInputDto: AuthInputRegistrationDto) {
    const newUser = this.authService.userRegistration(userInputDto);
    if (!newUser) {
      throw new BadRequestException();
    }
  }

  @UseGuards(ThrottlerGuard)
  @Post('login')
  @HttpCode(200)
  async loginUser(
    @Response({ passthrough: true }) res,
    @Request() req,
    @Body()
    userInputLoginDto: AuthInputLoginDto,
  ) {
    const userId = await this.authService.checkCredentials(userInputLoginDto);
    if (userId) {
      const tokens = await this.authService.loginUser(
        userId,
        req.ip!,
        req.headers['user-agent']!,
      );
      res.cookie('refreshToken', tokens?.refreshToken, {
        httpOnly: true,
        secure: true,
      });
      return { accessToken: tokens.accessToken };
    }
    throw new UnauthorizedException();
  }

  @Post('logout')
  @HttpCode(204)
  async userLogout(@Request() req) {
    const isUserLogout = await this.authService.logoutUser(
      req.cookies.refreshToken,
    );
    if (!isUserLogout) {
      throw new UnauthorizedException();
    }
  }

  @Post('refresh-token')
  @HttpCode(200)
  async createNewTokens(@Request() req, @Response({ passthrough: true }) res) {
    const newTokens = await this.authService.createNewTokens(
      req.cookies.refreshToken,
    );
    if (!newTokens) {
      throw new UnauthorizedException();
    }
    res.cookie('refreshToken', newTokens.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    return { accessToken: newTokens.accessToken };
  }

  @UseGuards(ThrottlerGuard)
  @Post('registration-confirmation')
  @HttpCode(204)
  async userRegistrationConfirmation(
    @Body() input: AuthInputEmailConfirmationDto,
  ) {
    const isUserVerified = await this.authService.confirmUserEmail(input.code);
    if (!isUserVerified) {
      throw new BadRequestException();
    }
  }

  @UseGuards(ThrottlerGuard)
  @Post('registration-email-resending')
  @HttpCode(204)
  async userRegistrationEmailResending(
    @Body() input: AuthInputEmailResendingDto,
  ) {
    const isUserExist = await this.authService.confirmUserEmailResending(
      input.email,
    );
    if (!isUserExist) {
      throw new BadRequestException([
        { message: 'User is already confirmed', field: 'email' },
      ]);
    }
  }

  @UseGuards(ThrottlerGuard)
  @Post('password-recovery')
  @HttpCode(204)
  async passwordRecovery(@Body() input: AuthInputEmailPasswordRecoveryDto) {
    const isEmailSend = await this.authService.passwordRecovery(input.email);
    if (!isEmailSend) {
      console.log('Email not be sand');
    }
  }

  @UseGuards(ThrottlerGuard)
  @Post('new-password')
  @HttpCode(204)
  async newPasswordConfirmation(
    @Body()
    input: AuthInputNewPasswordDto,
  ) {
    const isNewPasswordConfirm = await this.authService.newPasswordConfirmation(
      input.newPassword,
      input.recoveryCode,
    );
    if (!isNewPasswordConfirm) {
      throw new BadRequestException([
        { message: 'Some error, try later', field: 'email' },
      ]);
    }
  }

  @UseGuards(BearerAuthGuard)
  @Get('me')
  @HttpCode(200)
  async getUserInfo(@Request() req) {
    const userId = req.userId;
    if (userId) {
      const user = await this.usersQueryRepo.findUserById(userId);
      return user;
    }
    throw new UnauthorizedException();
  }
}
