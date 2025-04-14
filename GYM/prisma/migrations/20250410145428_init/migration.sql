/*
  Warnings:

  - You are about to drop the column `DiaChi` on the `hocvien` table. All the data in the column will be lost.
  - You are about to drop the column `Email` on the `hocvien` table. All the data in the column will be lost.
  - You are about to drop the column `GioiTinh` on the `hocvien` table. All the data in the column will be lost.
  - You are about to drop the column `NgaySinh` on the `hocvien` table. All the data in the column will be lost.
  - You are about to drop the column `SoDienThoai` on the `hocvien` table. All the data in the column will be lost.
  - You are about to drop the column `Ten` on the `hocvien` table. All the data in the column will be lost.
  - You are about to drop the column `Email` on the `huanluyenvien` table. All the data in the column will be lost.
  - You are about to drop the column `GioiTinh` on the `huanluyenvien` table. All the data in the column will be lost.
  - You are about to drop the column `HuanLuyenViencol` on the `huanluyenvien` table. All the data in the column will be lost.
  - You are about to drop the column `NgaySinh` on the `huanluyenvien` table. All the data in the column will be lost.
  - You are about to drop the column `Ten` on the `huanluyenvien` table. All the data in the column will be lost.
  - You are about to drop the column `MaAdmin` on the `taikhoan` table. All the data in the column will be lost.
  - You are about to drop the column `MaHLV` on the `taikhoan` table. All the data in the column will be lost.
  - You are about to drop the column `MaHV` on the `taikhoan` table. All the data in the column will be lost.
  - You are about to drop the `admin` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `idUSER` to the `hocvien` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idUser` to the `huanluyenvien` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idUser` to the `taikhoan` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `taikhoan` DROP FOREIGN KEY `FK_TK_Admin`;

-- DropForeignKey
ALTER TABLE `taikhoan` DROP FOREIGN KEY `FK_TK_MaHLV`;

-- DropForeignKey
ALTER TABLE `taikhoan` DROP FOREIGN KEY `FK_TK_MaHV`;

-- DropIndex
DROP INDEX `FK_TK_Admin_idx` ON `taikhoan`;

-- DropIndex
DROP INDEX `MaHLV_idx` ON `taikhoan`;

-- DropIndex
DROP INDEX `MaHV_idx` ON `taikhoan`;

-- AlterTable
ALTER TABLE `hocvien` DROP COLUMN `DiaChi`,
    DROP COLUMN `Email`,
    DROP COLUMN `GioiTinh`,
    DROP COLUMN `NgaySinh`,
    DROP COLUMN `SoDienThoai`,
    DROP COLUMN `Ten`,
    ADD COLUMN `idUSER` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `huanluyenvien` DROP COLUMN `Email`,
    DROP COLUMN `GioiTinh`,
    DROP COLUMN `HuanLuyenViencol`,
    DROP COLUMN `NgaySinh`,
    DROP COLUMN `Ten`,
    ADD COLUMN `idUser` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `taikhoan` DROP COLUMN `MaAdmin`,
    DROP COLUMN `MaHLV`,
    DROP COLUMN `MaHV`,
    ADD COLUMN `idUser` INTEGER NOT NULL;

-- DropTable
DROP TABLE `admin`;

-- CreateTable
CREATE TABLE `user` (
    `idUser` INTEGER NOT NULL AUTO_INCREMENT,
    `Ten` VARCHAR(45) NULL,
    `NgaySinh` DATE NULL,
    `GioiTinh` TINYINT NULL DEFAULT 1,
    `DiaChi` VARCHAR(255) NULL,
    `SoDienThoai` VARCHAR(45) NULL,
    `Email` VARCHAR(45) NULL,

    PRIMARY KEY (`idUser`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `FK_HV_USER_idx` ON `hocvien`(`idUSER`);

-- CreateIndex
CREATE INDEX `FK_HLV_USER_idx` ON `huanluyenvien`(`idUser`);

-- CreateIndex
CREATE INDEX `FK_TK_USER_idx` ON `taikhoan`(`idUser`);

-- AddForeignKey
ALTER TABLE `hocvien` ADD CONSTRAINT `FK_HV_USER` FOREIGN KEY (`idUSER`) REFERENCES `user`(`idUser`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `huanluyenvien` ADD CONSTRAINT `FK_HLV_USER` FOREIGN KEY (`idUser`) REFERENCES `user`(`idUser`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `taikhoan` ADD CONSTRAINT `FK_TK_USER` FOREIGN KEY (`idUser`) REFERENCES `user`(`idUser`) ON DELETE CASCADE ON UPDATE CASCADE;
