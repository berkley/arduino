//
//  SWFireController.h
//  LEDControl
//
//  Created by Chad Berkley on 7/26/14.
//  Copyright (c) 2014 Chad Berkley. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "SWRadThingController.h"

@interface SWFireController : SWRadThingController
{
}

+ (SWFireController*)instance;
- (void)puff1;
- (void)puff2;
- (void)puff3;
- (void)seq123;
- (void)seq321;
- (void)seqAll;

@end
