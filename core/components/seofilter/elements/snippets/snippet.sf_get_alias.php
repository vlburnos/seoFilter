<?php

/** @var array $scriptProperties */
/** @var seoFilter $seoFilter */
if (!$seoFilter = $modx->getService('seoFilter', 'seoFilter', $modx->getOption('seofilter_core_path', null, $modx->getOption('core_path') . 'components/seofilter/') . 'model/seofilter/', $scriptProperties)) {
    return 'Could not load seoFilter class!';
}

$param = empty($param) ? '' : $param;
$value = empty($value) ? '' : $value;

if(empty ($param) || empty($value)) {
    return '';

}

return $seoFilter->getParamValueAlias($param, $value);