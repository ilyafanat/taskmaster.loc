<?php

class MyDB
{

    protected $connection;

    function __construct()
    {
        $this->connection = new PDO("sqlite:task_master.db");
        $this->createTableTasks();
    }

    public function insertTask($text, $parent_id)
    {
        if ($this->connection->exec("INSERT INTO Tasks (name, parent_id) VALUES ('" . $text . "', '" . $parent_id . "');")) {
            $data['status'] = '201';
            $data['location'] = '/task/' . $this->connection->lastInsertId();
        } else {
            $data['status'] = '404';
        }

        return $data;
    }

    public function getTasks()
    {
        if ($data['list'] = $this->connection->query('select id, name, parent_id from Tasks')->fetchAll(PDO::FETCH_ASSOC)) {
            $data['status'] = '200';
        } else {
            $data['status'] = '404';
        }

        return $data;
    }

    public function deleteTask($id)
    {
        $sql = "with all_ids as (
                select id, parent_id
                from tasks
                where id = $id
                union all
                select t.id, t.parent_id
                from tasks t
                join all_ids p on p.id = t.parent_id
        )       
        delete from tasks
        where id in (select id from all_ids)";

        if ($this->connection->exec($sql)) {
            $data['status'] = '200';
        } else {
            $data['status'] = '404';
        }
        return $data;
    }

    public function updateTask($id, $name)
    {
        if ($this->connection->exec('update Tasks set name = "' . $name . '" where id = ' . $id)) {
            $data['status'] = '200';
        } else {
            $data['status'] = '404';
        }
        return $data;
    }

    function createTableTasks()
    {
        chmod('task_master.db', 0666);
        return $this->connection->exec("CREATE TABLE IF NOT EXISTS Tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, name NOT NULL, parent_id INTEGER)");
    }
}

