import {MigrationInterface, QueryRunner, getCustomRepository} from "typeorm";
import {AdminRepository} from '../repositories/AdminRepository'
import {Admin} from "../entity/Admin";

export class CreateAdminUser1573412561225 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        let admin = new Admin();
        const adminRepository = getCustomRepository(AdminRepository);

        admin.username = "admin";
        admin.password = "admin";
        admin.email = "admin@admin.com";
        admin.hashPassword();
        await adminRepository.save(admin);

        admin = new Admin();
        admin.username = "admin-2";
        admin.password = "admin";
        admin.email = "admin-2@admin.com";
        admin.hashPassword();
        await adminRepository.save(admin);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }
}
