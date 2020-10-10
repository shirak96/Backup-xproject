import { EntityRepository, Repository } from "typeorm";
import { Admin } from "../entity/Admin";

/*
* Extend typeorm ORM model by adding new function
* */
@EntityRepository(Admin)
export class AdminRepository extends Repository<Admin> {
  findByEmail(email: string) {
    return this.findOne({ email });
  }
}
