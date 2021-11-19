import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterDto {
	@IsString({ message: 'O campo Primeiro Nome deve ser String' })
	@IsNotEmpty({ message: 'O campo Primeiro Nome não pode ser Vazio' })
	public firstName: string;

	@IsString({ message: 'O campo Segundo Nome deve ser String' })
	@IsNotEmpty({ message: 'O campo Segundo Nome não pode ser Vazio' })
	public lastName: string;

	@IsString({ message: 'O campo Email deve ser String' })
	@IsNotEmpty({ message: 'O campo Email não pode ser Vazio' })
	public email: string;

	@IsString({ message: 'O campo Senha deve ser String' })
	@IsNotEmpty({ message: 'O campo Senha não pode ser Vazio' })
	public password: string;
}
