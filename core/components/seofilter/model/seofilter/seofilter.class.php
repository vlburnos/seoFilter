<?php

require_once (dirname(__FILE__) . '/piecesmap.class.php');

/**
 * The base class for seoFilter.
 */
class seoFilter {
	/* @var modX $modx */
	public $modx;

    private $piecesMap;


	/**
	 * @param modX $modx
	 * @param array $config
	 */
	function __construct(modX &$modx, array $config = array()) {
		$this->modx =& $modx;

        $this->piecesMap = new piecesMap($modx);

		$corePath = $this->modx->getOption('seofilter_core_path', $config, $this->modx->getOption('core_path') . 'components/seofilter/');
		$assetsUrl = $this->modx->getOption('seofilter_assets_url', $config, $this->modx->getOption('assets_url') . 'components/seofilter/');
		$connectorUrl = $assetsUrl . 'connector.php';

		$this->config = array_merge(array(
			'assetsUrl' => $assetsUrl,
			'cssUrl' => $assetsUrl . 'css/',
			'jsUrl' => $assetsUrl . 'js/',
			'imagesUrl' => $assetsUrl . 'images/',
			'connectorUrl' => $connectorUrl,

			'corePath' => $corePath,
			'modelPath' => $corePath . 'model/',
			'chunksPath' => $corePath . 'elements/chunks/',
			'templatesPath' => $corePath . 'elements/templates/',
			'chunkSuffix' => '.chunk.tpl',
			'snippetsPath' => $corePath . 'elements/snippets/',
			'processorsPath' => $corePath . 'processors/'
		), $config);

		$this->modx->addPackage('seofilter', $this->config['modelPath']);
		$this->modx->lexicon->load('seofilter:default');
	}


    public function getParamValueAlias($param, $value) {
        return $this->piecesMap->getAlias($param, $value);
    }

    public function getParamValueByAlias($alias){
        return $this->piecesMap->getPieceData($alias);
    }

}