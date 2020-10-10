import { EntityRepository, Repository } from "typeorm";
import { User } from "../entity/User";

/*
* Extend typeorm ORM model by adding new function
* */
@EntityRepository(User)
export class UserRepository extends Repository<User> {
    findByEmail(email: string) {
        return this.findOne({ email });
    }
}
