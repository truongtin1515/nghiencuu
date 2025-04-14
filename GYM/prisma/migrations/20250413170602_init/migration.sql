-- CreateTable
CREATE TABLE `buaan` (
    `idBuaAn` INTEGER NOT NULL AUTO_INCREMENT,
    `TenBua` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`idBuaAn`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `thucdon` (
    `idThucDon` INTEGER NOT NULL AUTO_INCREMENT,
    `idMaHV` INTEGER NOT NULL,
    `TenThucDon` VARCHAR(255) NULL,
    `SoCalo` INTEGER NULL,
    `NgayBatDau` DATE NULL,

    INDEX `FK_HV_TD_idx`(`idMaHV`),
    PRIMARY KEY (`idThucDon`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chitietthucdon` (
    `idchitietthucdon` INTEGER NOT NULL AUTO_INCREMENT,
    `idThucDon` INTEGER NOT NULL,
    `idBuaAn` INTEGER NOT NULL,
    `Ngay` DATE NULL,
    `Mota` VARCHAR(255) NULL,

    INDEX `FK_CTTD_TD_idx`(`idThucDon`),
    INDEX `FK_CTTD_BA_idx`(`idBuaAn`),
    PRIMARY KEY (`idchitietthucdon`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `thucdon` ADD CONSTRAINT `FK_HV_TD` FOREIGN KEY (`idMaHV`) REFERENCES `hocvien`(`idMaHV`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chitietthucdon` ADD CONSTRAINT `FK_CTTD_TD` FOREIGN KEY (`idThucDon`) REFERENCES `thucdon`(`idThucDon`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chitietthucdon` ADD CONSTRAINT `FK_CTTD_BA` FOREIGN KEY (`idBuaAn`) REFERENCES `buaan`(`idBuaAn`) ON DELETE CASCADE ON UPDATE CASCADE;
