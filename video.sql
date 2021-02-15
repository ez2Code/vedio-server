create table if not exists tbl_file_sys (
    id integer primary key autoincrement,
    file_name text,
    file_directory text,
    file_path text unique,
    enabled bool default true,
    check_time text
);

#####
create table if not exists tbl_scan_directory (
    id integer primary key autoincrement,
    directory_path text unique
);

#####
create table if not exists tbl_file_tree (
    id integer primary key autoincrement,
    current_path text unique,
    parent_path text,
    current_name text
);
