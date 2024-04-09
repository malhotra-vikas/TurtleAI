CREATE TABLE `Users` (
  `emailid` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `managerid` varchar(255) NOT NULL,
  PRIMARY KEY (`emailid`),
  UNIQUE KEY `emailid` (`emailid`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Projects` (
  `projectid` int NOT NULL AUTO_INCREMENT,
  `projectname` varchar(255) NOT NULL,
  PRIMARY KEY (`projectid`),
  UNIQUE KEY `projectname` (`projectname`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Tasks` (
  `taskid` int NOT NULL AUTO_INCREMENT,
  `taskname` varchar(255) NOT NULL,
  PRIMARY KEY (`taskid`),
  UNIQUE KEY `taskname` (`taskname`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Journal` (
  `journalid` int NOT NULL AUTO_INCREMENT,
  `type` varchar(10) NOT NULL,
  `entry` varchar(255) NOT NULL,
  PRIMARY KEY (`journalid`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

ALTER TABLE `Journal`
ADD COLUMN `taskid` int DEFAULT NULL,
ADD COLUMN `projectid` int DEFAULT NULL,
ADD COLUMN `emailid` varchar(255) NOT NULL,
ADD CONSTRAINT `fk_journal_tasks` FOREIGN KEY (`taskid`) REFERENCES `Tasks` (`taskid`),
ADD CONSTRAINT `fk_journal_projects` FOREIGN KEY (`projectid`) REFERENCES `Projects` (`projectid`),
ADD CONSTRAINT `fk_journal_users` FOREIGN KEY (`emailid`) REFERENCES `Users` (`emailid`);
