<?php

ini_set("display_errors", 1);
ini_set("track_errors", 1);
ini_set("html_errors", 1);
error_reporting(E_ALL);
require_once 'db.php';

$db = new MyDB();
$request = new Request();

switch ($request->method) {
    case 'GET':
        if ($request->urlElements[1] === 'task') {
            $response = $db->getTasks();
            http_response_code($response['status']);
            echo json_encode($response['list']);
            exit;
        }
        break;
    case 'POST':
        $response = $db->insertTask($request->urlElements[2], $request->urlElements[4]);
        http_response_code($response['status']);
        header("Location: " . $response['location']);
        exit;
        break;
    case 'PUT':
        $response = $db->updateTask($request->urlElements[2], $request->urlElements[4]);
        http_response_code($response['status']);
        exit;
        break;
    case 'DELETE':
        $response = $db->deleteTask($request->urlElements[2]);
        http_response_code($response['status']);
        exit;
        break;
}


class Request
{
    public $urlElements;
    public $method;
    public $parameters;

    public function __construct()
    {
        $this->method = $_SERVER['REQUEST_METHOD'];
        $this->urlElements = explode('/', $_SERVER['REQUEST_URI']);
        $this->parseIncomingParams();
        $this->format = 'json';
        if (isset($this->parameters['format'])) {
            $this->format = $this->parameters['format'];
        }
    }

    public function parseIncomingParams()
    {
        $parameters = array();

        if (isset($_SERVER['QUERY_STRING'])) {
            parse_str($_SERVER['QUERY_STRING'], $parameters);
        }

        $body = file_get_contents("php://input");
        $content_type = false;
        if (isset($_SERVER['CONTENT_TYPE'])) {
            $content_type = $_SERVER['CONTENT_TYPE'];
        }
        switch ($content_type) {
            case "application/json":
                $body_params = json_decode($body);
                if ($body_params) {
                    foreach ($body_params as $param_name => $param_value) {
                        $parameters[$param_name] = $param_value;
                    }
                }
                $this->format = "json";
                break;
            case "application/x-www-form-urlencoded":
                parse_str($body, $postvars);
                foreach ($postvars as $field => $value) {
                    $parameters[$field] = $value;

                }
                $this->format = "html";
                break;
            default:
                break;
        }
        $this->parameters = $parameters;
    }
}

require_once 'templates/header.php';


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


