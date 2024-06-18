<?php

namespace SilverStripe\Admin\Tests\Navigator;

use SilverStripe\Admin\Navigator\SilverStripeNavigatorItem;
use SilverStripe\Dev\TestOnly;

class SilverStripeNavigatorTest_TestItem extends SilverStripeNavigatorItem implements TestOnly
{
    public function getTitle()
    {
        return SilverStripeNavigatorTest_TestItem::class;
    }

    public function getHTML()
    {
        return null;
    }
}
