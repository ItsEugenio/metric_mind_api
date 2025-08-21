import bcrypt from 'bcrypt';

export class PasswordUtils {
  private static readonly SALT_ROUNDS = 12;

  static async hashPassword(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, this.SALT_ROUNDS);
    } catch (error) {
      throw new Error('Error al encriptar la contraseña');
    }
  }

  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      throw new Error('Error al comparar contraseñas');
    }
  }

  static validatePasswordStrength(password: string): { isValid: boolean; message: string } {
    if (password.length < 6) {
      return {
        isValid: false,
        message: 'La contraseña debe tener al menos 6 caracteres'
      };
    }

    if (!/(?=.*[a-z])/.test(password)) {
      return {
        isValid: false,
        message: 'La contraseña debe contener al menos una letra minúscula'
      };
    }

    if (!/(?=.*[A-Z])/.test(password)) {
      return {
        isValid: false,
        message: 'La contraseña debe contener al menos una letra mayúscula'
      };
    }

    if (!/(?=.*\d)/.test(password)) {
      return {
        isValid: false,
        message: 'La contraseña debe contener al menos un número'
      };
    }

    return {
      isValid: true,
      message: 'Contraseña válida'
    };
  }
}
