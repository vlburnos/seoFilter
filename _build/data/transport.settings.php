<?php

$settings = array();

$tmp = array(
	'max_depth' => array(
		'xtype' => 'numberfield',
		'value' => 2,
		'area' => 'seofilter_main',
	),
);

foreach ($tmp as $k => $v) {
	/* @var modSystemSetting $setting */
	$setting = $modx->newObject('modSystemSetting');
	$setting->fromArray(array_merge(
		array(
			'key' => 'seofilter_' . $k,
			'namespace' => PKG_NAME_LOWER,
		), $v
	), '', true, true);

	$settings[] = $setting;
}

unset($tmp);
return $settings;
