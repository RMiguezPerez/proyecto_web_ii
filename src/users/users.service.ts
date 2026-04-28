import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create_user.dto';

@Injectable()
export class UsersService {



    create(createUserDto: CreateUserDto){
        const user = {
            id: Date.now(),
            ...createUserDto
        }
        //const user = this.capaEncargaDeObtencioDeUsersDeBD()

        return user;
    }
}
