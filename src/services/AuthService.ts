import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { JwtUtils } from '../utils/jwt';
import { PasswordUtils } from '../utils/password';
import { CreateUserDto, LoginDto } from '../types';

export class AuthService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  async register(userData: CreateUserDto): Promise<{ user: Omit<User, 'password'>; token: string }> {
    const existingUser = await this.userRepository.findOne({
      where: { email: userData.email }
    });

    if (existingUser) {
      throw new Error('El usuario ya existe con este email');
    }

    const passwordValidation = PasswordUtils.validatePasswordStrength(userData.password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.message);
    }

    const hashedPassword = await PasswordUtils.hashPassword(userData.password);

    const user = this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);

    const token = JwtUtils.generateToken({
      userId: savedUser.id,
      email: savedUser.email,
    });

    const { password, ...userWithoutPassword } = savedUser;

    return {
      user: userWithoutPassword,
      token,
    };
  }

  async login(loginData: LoginDto): Promise<{ user: Omit<User, 'password'>; token: string }> {
    const user = await this.userRepository.findOne({
      where: { email: loginData.email }
    });

    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    const isPasswordValid = await PasswordUtils.comparePassword(
      loginData.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new Error('Credenciales inválidas');
    }

    const token = JwtUtils.generateToken({
      userId: user.id,
      email: user.email,
    });

    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }

  async getUserProfile(userId: number): Promise<Omit<User, 'password'> | null> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'email', 'name', 'createdAt', 'updatedAt'],
    });

    return user;
  }

  async updateUserProfile(
    userId: number,
    updateData: Partial<Pick<User, 'name' | 'email'>>
  ): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findOne({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateData.email }
      });

      if (existingUser) {
        throw new Error('El email ya está en uso');
      }
    }

    Object.assign(user, updateData);
    const updatedUser = await this.userRepository.save(user);

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async changePassword(
    userId: number,
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const isOldPasswordValid = await PasswordUtils.comparePassword(
      oldPassword,
      user.password
    );

    if (!isOldPasswordValid) {
      throw new Error('La contraseña actual es incorrecta');
    }

    const passwordValidation = PasswordUtils.validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.message);
    }

    const hashedNewPassword = await PasswordUtils.hashPassword(newPassword);

    user.password = hashedNewPassword;
    await this.userRepository.save(user);
  }
}
