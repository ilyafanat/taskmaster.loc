<?php
ini_set("display_errors", 1);
ini_set("track_errors", 1);
ini_set("html_errors", 1);
error_reporting(E_ALL);
//phpinfo();
require_once 'templates/header.php';
require_once 'db.php';

$url = $_SERVER['REQUEST_URI'];

$db = new MyDB();

if ($url === '/addTask') {
    $db->insertTask($_POST['name']);
}
if ($url === '/getTasks') {
    var_dump($db->getTasks());
}
?>
    <div class="">
        <input type="text" id="task-text">
        <a href="#" id="add-task">Add task</a>
    </div>
    <h3>Incompleted Tasks</h3>
    <div class="added-task">
        <ul id="incomplete-task">

        </ul>
    </div>
<?php
require_once 'templates/footer.php';


