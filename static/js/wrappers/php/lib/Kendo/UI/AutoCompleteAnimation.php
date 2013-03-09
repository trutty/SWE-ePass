<?php

namespace Kendo\UI;

class AutoCompleteAnimation extends \Kendo\SerializableObject {
//>> Properties

    /**
    * Animation to be used for closing of the popup.
    * @param \Kendo\UI\AutoCompleteAnimationClose|array $value
    * @return \Kendo\UI\AutoCompleteAnimation
    */
    public function close($value) {
        return $this->setProperty('close', $value);
    }

    /**
    * Animation to be used for opening of the popup.
    * @param \Kendo\UI\AutoCompleteAnimationOpen|array $value
    * @return \Kendo\UI\AutoCompleteAnimation
    */
    public function open($value) {
        return $this->setProperty('open', $value);
    }

//<< Properties
}

?>
