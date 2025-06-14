import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1700000000000 implements MigrationInterface {
    name = 'InitialMigration1700000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create enums
        await queryRunner.query(`CREATE TYPE "public"."sheets_type_enum" AS ENUM('income', 'preliminary')`);
        await queryRunner.query(`CREATE TYPE "public"."debts_status_enum" AS ENUM('active', 'partial', 'closed')`);
        await queryRunner.query(`CREATE TYPE "public"."clothing_parameters_gender_enum" AS ENUM('male', 'female', 'child')`);

        // Create users table
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(255) NOT NULL, "name" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "refreshToken" character varying(500), "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);

        // Create sheets table
        await queryRunner.query(`CREATE TABLE "sheets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "amount" numeric(10,2) NOT NULL, "date" date NOT NULL, "note" text, "type" "public"."sheets_type_enum" NOT NULL DEFAULT 'income', "userId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c1932ea124e6ba9f4a9311e0e62" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8df8e5c1b5e3e2a9e5d6e8c9f4" ON "sheets" ("userId", "type") `);

        // Create expenses table
        await queryRunner.query(`CREATE TABLE "expenses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "amount" numeric(10,2) NOT NULL, "category" character varying(100), "note" text, "sheetId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_94c3ceb17e3140abc9282c20610" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1e7f8e5c1b5e3e2a9e5d6e8c9f5" ON "expenses" ("sheetId") `);

        // Create debts table
        await queryRunner.query(`CREATE TABLE "debts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "amount" numeric(10,2) NOT NULL, "date" date NOT NULL, "category" character varying(100), "status" "public"."debts_status_enum" NOT NULL DEFAULT 'active', "note" text, "userId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3d6b872e1b9731b0f72e3d5638e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2e7f8e5c1b5e3e2a9e5d6e8c9f6" ON "debts" ("userId", "status") `);

        // Create payments table
        await queryRunner.query(`CREATE TABLE "payments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" numeric(10,2) NOT NULL, "date" date, "note" text, "preliminary" boolean NOT NULL DEFAULT false, "debtId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3e7f8e5c1b5e3e2a9e5d6e8c9f7" ON "payments" ("debtId", "preliminary") `);

        // Create clothing_parameters table
        await queryRunner.query(`CREATE TABLE "clothing_parameters" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "gender" "public"."clothing_parameters_gender_enum" NOT NULL DEFAULT 'male', "height" numeric(5,2), "weight" numeric(5,2), "chest" numeric(5,2), "underbust" numeric(5,2), "waist" numeric(5,2), "hips" numeric(5,2), "neck" numeric(5,2), "foot" numeric(5,2), "inseam" numeric(5,2), "wrist" numeric(5,2), "head" numeric(5,2), "userId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e6de7e8b41e3b1f3c9d2e6f7e8c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_4e7f8e5c1b5e3e2a9e5d6e8c9f8" ON "clothing_parameters" ("userId") `);

        // Create scale_calculations table
        await queryRunner.query(`CREATE TABLE "scale_calculations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "scale" integer NOT NULL, "textHeight" numeric(6,3) NOT NULL, "userId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8d6b872e1b9731b0f72e3d5638f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5e7f8e5c1b5e3e2a9e5d6e8c9f9" ON "scale_calculations" ("userId", "createdAt") `);

        // Add foreign keys
        await queryRunner.query(`ALTER TABLE "sheets" ADD CONSTRAINT "FK_8df8e5c1b5e3e2a9e5d6e8c9f4" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expenses" ADD CONSTRAINT "FK_1e7f8e5c1b5e3e2a9e5d6e8c9f5" FOREIGN KEY ("sheetId") REFERENCES "sheets"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "debts" ADD CONSTRAINT "FK_2e7f8e5c1b5e3e2a9e5d6e8c9f6" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_3e7f8e5c1b5e3e2a9e5d6e8c9f7" FOREIGN KEY ("debtId") REFERENCES "debts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "clothing_parameters" ADD CONSTRAINT "FK_4e7f8e5c1b5e3e2a9e5d6e8c9f8" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scale_calculations" ADD CONSTRAINT "FK_5e7f8e5c1b5e3e2a9e5d6e8c9f9" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign keys
        await queryRunner.query(`ALTER TABLE "scale_calculations" DROP CONSTRAINT "FK_5e7f8e5c1b5e3e2a9e5d6e8c9f9"`);
        await queryRunner.query(`ALTER TABLE "clothing_parameters" DROP CONSTRAINT "FK_4e7f8e5c1b5e3e2a9e5d6e8c9f8"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_3e7f8e5c1b5e3e2a9e5d6e8c9f7"`);
        await queryRunner.query(`ALTER TABLE "debts" DROP CONSTRAINT "FK_2e7f8e5c1b5e3e2a9e5d6e8c9f6"`);
        await queryRunner.query(`ALTER TABLE "expenses" DROP CONSTRAINT "FK_1e7f8e5c1b5e3e2a9e5d6e8c9f5"`);
        await queryRunner.query(`ALTER TABLE "sheets" DROP CONSTRAINT "FK_8df8e5c1b5e3e2a9e5d6e8c9f4"`);

        // Drop indexes
        await queryRunner.query(`DROP INDEX "public"."IDX_5e7f8e5c1b5e3e2a9e5d6e8c9f9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4e7f8e5c1b5e3e2a9e5d6e8c9f8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3e7f8e5c1b5e3e2a9e5d6e8c9f7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2e7f8e5c1b5e3e2a9e5d6e8c9f6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1e7f8e5c1b5e3e2a9e5d6e8c9f5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8df8e5c1b5e3e2a9e5d6e8c9f4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);

        // Drop tables
        await queryRunner.query(`DROP TABLE "scale_calculations"`);
        await queryRunner.query(`DROP TABLE "clothing_parameters"`);
        await queryRunner.query(`DROP TABLE "payments"`);
        await queryRunner.query(`DROP TABLE "debts"`);
        await queryRunner.query(`DROP TABLE "expenses"`);
        await queryRunner.query(`DROP TABLE "sheets"`);
        await queryRunner.query(`DROP TABLE "users"`);

        // Drop enums
        await queryRunner.query(`DROP TYPE "public"."clothing_parameters_gender_enum"`);
        await queryRunner.query(`DROP TYPE "public"."debts_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."sheets_type_enum"`);
    }
}