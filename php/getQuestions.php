<?php
include './connection.php'; // Incluir el archivo de conexión

$query = 'SELECT * FROM questions';
$result = $connection->query($query);

$questions = array();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $question = $row;
        $query2 = 'SELECT answer FROM answers WHERE idQuestion=' . $row['id'];
        $result2 = $connection->query($query2);

        if ($result2->num_rows > 0) {
            $answers = array();
            while ($row2 = $result2->fetch_assoc()) {
                $answers[] = $row2['answer'];
            }
            $question['answers'] = $answers;
        } else {
            $question['answers'] = array(); // Si no hay respuestas, establece un array vacío
        }

        $questions[] = $question;
    }
}

echo json_encode($questions);

$connection->close();
?>