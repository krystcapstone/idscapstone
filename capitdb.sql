-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema capitdb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema capitdb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `capitdb` DEFAULT CHARACTER SET utf8 ;
USE `capitdb` ;

-- -----------------------------------------------------
-- Table `capitdb`.`login`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `capitdb`.`login` (
  `idlogin` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NULL,
  `password` VARCHAR(45) NULL,
  PRIMARY KEY (`idlogin`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `capitdb`.`camera`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `capitdb`.`camera` (
  `cameraid` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  `status` VARCHAR(45) NULL,
  `location` VARCHAR(45) NULL,
  `locationprev` VARCHAR(45) NULL,
  `uptime` TIME NULL,
  PRIMARY KEY (`cameraid`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `capitdb`.`clips`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `capitdb`.`clips` (
  `date` DATE NOT NULL,
  `no_of_clips` INT NULL,
  `status` VARCHAR(45) NULL DEFAULT 'Not Reviewed',
  `remarks` VARCHAR(45) NULL,
  PRIMARY KEY (`date`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `capitdb`.`clip_view`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `capitdb`.`clip_view` (
  `clipid` INT NOT NULL AUTO_INCREMENT,
  `date` DATE NULL,
  `time` TIME NULL,
  `status` VARCHAR(45) NULL DEFAULT 'Not Reviewed',
  `remarks` VARCHAR(45) NULL,
  `cameraid` INT NULL,
  `videofilename` VARCHAR(45) NULL,
  PRIMARY KEY (`clipid`),
  INDEX `FKCV1_idx` (`cameraid` ASC),
  INDEX `FKCV1_idx1` (`date` ASC),
  CONSTRAINT `FKCV2`
    FOREIGN KEY (`cameraid`)
    REFERENCES `capitdb`.`camera` (`cameraid`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `FKCV1`
    FOREIGN KEY (`date`)
    REFERENCES `capitdb`.`clips` (`date`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `capitdb`.`snapshots`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `capitdb`.`snapshots` (
  `date` DATE NOT NULL,
  `no_of_snaps` INT NULL,
  `status` VARCHAR(45) NULL DEFAULT 'Not Reviewed',
  `remarks` VARCHAR(45) NULL,
  PRIMARY KEY (`date`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `capitdb`.`report`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `capitdb`.`report` (
  `datetime` DATE NOT NULL,
  `no_of_reports` INT NULL,
  PRIMARY KEY (`datetime`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `capitdb`.`logs`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `capitdb`.`logs` (
  `date` DATE NOT NULL,
  PRIMARY KEY (`date`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `capitdb`.`overview`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `capitdb`.`overview` (
  `overviewid` INT NOT NULL AUTO_INCREMENT,
  `idlogin` INT NULL,
  `cameraid` INT NULL,
  `clipdate` DATE NULL,
  `snapshotdate` DATE NULL,
  `reportdate` DATE NULL,
  `logdate` DATE NULL,
  PRIMARY KEY (`overviewid`),
  INDEX `FKO1_idx` (`idlogin` ASC),
  INDEX `FKO2_idx` (`cameraid` ASC),
  INDEX `FKO3_idx` (`clipdate` ASC),
  INDEX `FKO4_idx` (`snapshotdate` ASC),
  INDEX `FKO5_idx` (`reportdate` ASC),
  INDEX `FKO6_idx` (`logdate` ASC),
  CONSTRAINT `FKO1`
    FOREIGN KEY (`idlogin`)
    REFERENCES `capitdb`.`login` (`idlogin`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `FKO2`
    FOREIGN KEY (`cameraid`)
    REFERENCES `capitdb`.`camera` (`cameraid`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `FKO3`
    FOREIGN KEY (`clipdate`)
    REFERENCES `capitdb`.`clips` (`date`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `FKO4`
    FOREIGN KEY (`snapshotdate`)
    REFERENCES `capitdb`.`snapshots` (`date`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `FKO5`
    FOREIGN KEY (`reportdate`)
    REFERENCES `capitdb`.`report` (`datetime`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `FKO6`
    FOREIGN KEY (`logdate`)
    REFERENCES `capitdb`.`logs` (`date`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `capitdb`.`snapshots_view`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `capitdb`.`snapshots_view` (
  `snapid` INT NOT NULL AUTO_INCREMENT,
  `date` DATE NULL,
  `snap` VARCHAR(45) NULL,
  `time` TIME NULL,
  `cameraid` INT NULL,
  PRIMARY KEY (`snapid`),
  INDEX `FKSV01_idx` (`cameraid` ASC),
  INDEX `FKSV01_idx1` (`date` ASC),
  CONSTRAINT `FKSV02`
    FOREIGN KEY (`cameraid`)
    REFERENCES `capitdb`.`camera` (`cameraid`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `FKSV01`
    FOREIGN KEY (`date`)
    REFERENCES `capitdb`.`snapshots` (`date`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `capitdb`.`report_view`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `capitdb`.`report_view` (
  `reportid` INT NOT NULL AUTO_INCREMENT,
  `datetime` DATE NULL,
  `time` TIME NULL,
  `report` VARCHAR(255) NULL,
  `snap` VARCHAR(45) NULL,
  `cameraid` INT NULL,
  PRIMARY KEY (`reportid`),
  INDEX `FKRV01_idx` (`cameraid` ASC),
  INDEX `FKRV02_idx` (`datetime` ASC),
  CONSTRAINT `FKRV01`
    FOREIGN KEY (`cameraid`)
    REFERENCES `capitdb`.`camera` (`cameraid`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `FKRV02`
    FOREIGN KEY (`datetime`)
    REFERENCES `capitdb`.`report` (`datetime`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `capitdb`.`logs_view`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `capitdb`.`logs_view` (
  `logid` INT NOT NULL AUTO_INCREMENT,
  `date` DATE NULL,
  `text` VARCHAR(45) NULL,
  PRIMARY KEY (`logid`),
  CONSTRAINT `FKLV1`
    FOREIGN KEY (`date`)
    REFERENCES `capitdb`.`logs` (`date`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

INSERT INTO `capitdb`.`login` (`idlogin`, `username`, `password`) VALUES ('1', 'admin', '21232f297a57a5a743894a0e4a801fc3');

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
