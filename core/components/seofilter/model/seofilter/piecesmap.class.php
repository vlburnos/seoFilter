<?php

/**
* The base class for piecesMap
*/
class piecesMap {
/* @var modX $modx */
    public $modx;

    private $map = array();
    private $mapsLoaded = false;

    function __construct(modX &$modx) {
        $this->modx =& $modx;
    }

    private function loadMap() {
        $paramId2Name = array();

        $q = $this->modx->newQuery('sfParam');
        $q->select($this->modx->getSelectColumns('sfParam', 'sfParam'));
        if ($q->prepare() && $q->stmt->execute()) {
            $rows = $q->stmt->fetchAll(PDO::FETCH_ASSOC);

            foreach($rows as $row) {
                $this->map[$row['name']] = array(
                    'id' => $row['id'],
                    'pieces' => array(),
                );
                $paramId2Name[$row['id']] = $row['name'];
            }
        }

        $q = $this->modx->newQuery('sfPiece');
        $q->select($this->modx->getSelectColumns('sfPiece', 'sfPiece'));

        if ($q->prepare() && $q->stmt->execute()) {
            $rows = $q->stmt->fetchAll(PDO::FETCH_ASSOC);

            foreach($rows as $row) {
                if(!empty($row['alias'])) {
                    $this->map[$paramId2Name[$row['param']]]['pieces'][$row['alias']] = array(
                        'id' => $row['id'],
                        'param_id' => $row['param'],
                        'param' => $paramId2Name[$row['param']],
                        'value' => $row['value'],
                        'alias' => $row['alias'],
                        'correction' => $row['correction'],
                        'title' => !empty($row['correction']) ? $row['correction'] : $row['value'],
                    );
                }
            }
        }

        $this->mapsLoaded = true;
    }

    public function getAlias($param, $value) {
        if(!$this->mapsLoaded) {
            $this->loadMap();
        }

        if(array_key_exists($param, $this->map)) {
            foreach($this->map[$param]['pieces'] as $piece){
                if($piece['value'] == $value ) {
                    return $piece['alias'];
                }
            }

        }
        return '';
    }

    public function getPieceData($alias){
        if(empty($alias)) {
            return null;
        }

        if(!$this->mapsLoaded) {
            $this->loadMap();
        }

        foreach($this->map as $param => $paramData) {
            if(array_key_exists($alias, $paramData['pieces'])) {
                return $paramData['pieces'][$alias];
            }
        }

        return null;
    }
}