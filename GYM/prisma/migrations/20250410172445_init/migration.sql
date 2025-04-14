/*
  Warnings:

  - You are about to drop the column `NgayBatDau` on the `chitietmuctieu` table. All the data in the column will be lost.
  - You are about to drop the column `NgayKetThuc` on the `chitietmuctieu` table. All the data in the column will be lost.
  - You are about to drop the column `NgayBatDau` on the `chuongtrinhtap` table. All the data in the column will be lost.
  - You are about to drop the column `NgayKetThuc` on the `chuongtrinhtap` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[TenDangNhap]` on the table `taikhoan` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `chitietmuctieu` DROP COLUMN `NgayBatDau`,
    DROP COLUMN `NgayKetThuc`,
    ADD COLUMN `ThoiGian` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `chuongtrinhtap` DROP COLUMN `NgayBatDau`,
    DROP COLUMN `NgayKetThuc`,
    ADD COLUMN `ThoiGian` VARCHAR(255) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `taikhoan_TenDangNhap_key` ON `taikhoan`(`TenDangNhap`);
