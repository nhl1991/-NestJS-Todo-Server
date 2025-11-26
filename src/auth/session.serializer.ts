import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { UserService } from "src/user/user.service";


@Injectable()
export class SessionSerializer extends PassportSerializer {
    constructor(private userService: UserService){
        super();
    }

    serializeUser(user: any, done: Function) {
        done(null, user.email);
    }

    async deserializeUser(payload: any, done: Function) {
        const user = await this.userService.getUser(payload);
        if(!user) {
            done(new Error('No user'), null)
            return;
        }

        const { password, ...userInfo } = user;

        done(null, userInfo);
    }
}