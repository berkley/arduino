//
//  SWRadThingController.h
//  LEDControl
//
//  Created by Chad Berkley on 7/26/14.
//  Copyright (c) 2014 Chad Berkley. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface SWRadThingController : NSObject

@property (nonatomic, strong) NSString *restAddress;
@property (nonatomic, strong) NSString *wsAddress;

+ (SWRadThingController*)instance;
- (void)sendRESTCommand:(NSString*)command;

@end
