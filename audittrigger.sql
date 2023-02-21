
/*logs (not yet)*/
    /* insert*/
    CREATE DEFINER=`root`@`localhost` TRIGGER `audit_trail_log_insert` AFTER INSERT ON `logs_view` FOR EACH ROW BEGIN
    INSERT INTO audittable (date, time, tablename, columnname, event, user)
    VALUES (CURDATE(), CURRENT_TIMESTAMP(), `logs_view`, 2, "INSERT", 5);
    END;
    /*update*/
    CREATE DEFINER=`root`@`localhost` TRIGGER `audit_trail_log_update` AFTER UPDATE ON `logs_view` FOR EACH ROW BEGIN
    INSERT INTO audittable (date, time, tablename, columnname, event, old, new, user)
    
    VALUES (CURDATE(), CURRENT_TIMESTAMP(), `logs_view`, 2, "UPDATE", 3, 4, 5);
    END;
    /*delete*/
    CREATE DEFINER=`root`@`localhost` TRIGGER `audit_trail_log_delete` AFTER DELETE ON `logs_view` FOR EACH ROW BEGIN
    INSERT INTO audittable (date, time, tablename, columnname, event, user)
    VALUES (CURDATE(), CURRENT_TIMESTAMP(), `logs_view`, 2, "DELETE", 5);
    END;

/*clip (not yet)*/
    /* insert*/
    CREATE DEFINER=`root`@`localhost` TRIGGER `audit_trail_clip_insert` AFTER INSERT ON `clip_view` FOR EACH ROW BEGIN
    INSERT INTO audittable (date, time, tablename, columnname, event, user)
    VALUES (CURDATE(), CURRENT_TIMESTAMP(), `clip_view`, 2, "INSERT", 5);
    END;
    /*update*/
    CREATE DEFINER=`root`@`localhost` TRIGGER `audit_trail_clip_update` AFTER UPDATE ON `clip_view` FOR EACH ROW BEGIN
    INSERT INTO audittable (date, time, tablename, columnname, event, old, new, user)
    VALUES (CURDATE(), CURRENT_TIMESTAMP(), `clip_view`, 2, "UPDATE", @UPDATE, 4, 5);

    END;
    /*delete*/
    CREATE DEFINER=`root`@`localhost` TRIGGER `audit_trail_clip_delete` AFTER DELETE ON `clip_view` FOR EACH ROW BEGIN
    INSERT INTO audittable (date, time, tablename, columnname, event, user)
    VALUES (CURDATE(), CURRENT_TIMESTAMP(), `clip_view`, 2, "DELETE", 5);
    END;

/*snapshots (not yet)*/
    /* insert*/
    CREATE DEFINER=`root`@`localhost` TRIGGER `audit_trail_snap_insert` AFTER INSERT ON `snapshots_view` FOR EACH ROW BEGIN
    INSERT INTO audittable (date, time, tablename, columnname, event, user)
    VALUES (CURDATE(), CURRENT_TIMESTAMP(), `snapshots_view`, 2, "INSERT", 5);
    END;
    /*update*/
    CREATE DEFINER=`root`@`localhost` TRIGGER `audit_trail_snap_update` AFTER UPDATE ON `snapshots_view` FOR EACH ROW BEGIN
    INSERT INTO audittable (date, time, tablename, columnname, event, old, new, user)
    
    VALUES (CURDATE(), CURRENT_TIMESTAMP(), `snapshots_view`, 2, "UPDATE", 3, 4, 5);
    END;
    /*delete*/
    CREATE DEFINER=`root`@`localhost` TRIGGER `audit_trail_snap_delete` AFTER DELETE ON `snapshots_view` FOR EACH ROW BEGIN
    INSERT INTO audittable (date, time, tablename, columnname, event, user)
    VALUES (CURDATE(), CURRENT_TIMESTAMP(), `snapshots_view`, 2, "DELETE", 5);
    END;

/*reports (not yet)*/
    /* insert*/
    CREATE DEFINER=`root`@`localhost` TRIGGER `audit_trail_report_insert` AFTER INSERT ON `report_view` FOR EACH ROW BEGIN
    INSERT INTO audittable (date, time, tablename, columnname, event, user)
    VALUES (CURDATE(), CURRENT_TIMESTAMP(), `report_view`, 2, "INSERT", 5);
    END;
    /*update*/
    CREATE DEFINER=`root`@`localhost` TRIGGER `audit_trail_report_update` AFTER UPDATE ON `report_view` FOR EACH ROW BEGIN
    INSERT INTO audittable (date, time, tablename, columnname, event, old, new, user)
    
    VALUES (CURDATE(), CURRENT_TIMESTAMP(), `report_view`, 2, "UPDATE", 3, 4, 5);
    END;
    /*delete*/
    CREATE DEFINER=`root`@`localhost` TRIGGER `audit_trail_report_delete` AFTER DELETE ON `report_view` FOR EACH ROW BEGIN
    INSERT INTO audittable (date, time, tablename, columnname, event, user)
    VALUES (CURDATE(), CURRENT_TIMESTAMP(), `report_view`, 2, "DELETE", 5);
    END;

/*cameras (not yet)*/
    /* insert*/
    CREATE DEFINER=`root`@`localhost` TRIGGER `audit_trail_camera_insert` AFTER INSERT ON `camera_view` FOR EACH ROW BEGIN
    INSERT INTO audittable (date, time, tablename, columnname, event, user)
    VALUES (CURDATE(), CURRENT_TIMESTAMP(), `camera_view`, 2, "INSERT", 5);
    END;
    /*update*/
    CREATE DEFINER=`root`@`localhost` TRIGGER `audit_trail_camera_update` AFTER UPDATE ON `camera_view` FOR EACH ROW BEGIN
    INSERT INTO audittable (date, time, tablename, columnname, event, old, new, user)
    
    VALUES (CURDATE(), CURRENT_TIMESTAMP(), `camera_view`, 2, "UPDATE", 3, 4, 5);
    END;
    /*delete*/
    CREATE DEFINER=`root`@`localhost` TRIGGER `audit_trail_camera_delete` AFTER DELETE ON `camera_view` FOR EACH ROW BEGIN
    INSERT INTO audittable (date, time, tablename, columnname, event, user)
    VALUES (CURDATE(), CURRENT_TIMESTAMP(), `camera_view`, 2, "DELETE", 5);
    END;

/*users (not yet)*/
    /* insert*/
    CREATE DEFINER=`root`@`localhost` TRIGGER `audit_trail_user_insert` AFTER INSERT ON `users_view` FOR EACH ROW BEGIN
    INSERT INTO audittable (date, time, tablename, columnname, event, user)
    VALUES (CURDATE(), CURRENT_TIMESTAMP(), `users_view`, 2, "INSERT", 5);
    END;
    /*update*/
    CREATE DEFINER=`root`@`localhost` TRIGGER `audit_trail_user_update` AFTER UPDATE ON `users_view` FOR EACH ROW BEGIN
    INSERT INTO audittable (date, time, tablename, columnname, event, old, new, user)
    
    VALUES (CURDATE(), CURRENT_TIMESTAMP(), `users_view`, 2, "UPDATE", 3, 4, 5);
    END;
    /*delete*/
    CREATE DEFINER=`root`@`localhost` TRIGGER `audit_trail_user_delete` AFTER DELETE ON `users_view` FOR EACH ROW BEGIN
    INSERT INTO audittable (date, time, tablename, columnname, event, user)
    VALUES (CURDATE(), CURRENT_TIMESTAMP(), `users_view`, 2, "DELETE", 5);
    END;