<?php

class MyDB
{

    protected $connection;

    function __construct()
    {
        $this->connection = new PDO("sqlite:task_master.db");
    }

    public function insertTask($text, $parent_id)
    {
        return $this->connection->exec("INSERT INTO Tasks (name, parent_id) VALUES ('" . $text . "', '".$parent_id."');");
    }

    public function getTasks()
    {
        return $this->connection->query('select * from Tasks')->fetchAll();
    }
}


//class DB
//{
//    public $db;
//
//    function __construct()
//    {
//        $this->db = new SQLite3('task_master.db', 0666);
//        $this->createTableTasks();
//    }
//
//    function createTableTasks()
//    {
//        return $this->
//    }
//
//    public function insertTask($text)
//    {
//        return $this->db->exec("INSERT INTO Tasks (name) VALUES ('" . $text . "');");
//    }
//
//    public function getTasks()
//    {
//        return $this->db->query('select * from Tasks;')->fetchArray();
//    }
//
//}