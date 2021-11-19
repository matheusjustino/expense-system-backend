import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
	@IsString({ message: 'O campo Email deve ser String' })
	@IsNotEmpty({ message: 'O campo Email não pode ser Vazio' })
	public email: string;

	@IsString({ message: 'O campo Senha deve ser String' })
	@IsNotEmpty({ message: 'O campo Senha não pode ser Vazio' })
	public password: string;
}
