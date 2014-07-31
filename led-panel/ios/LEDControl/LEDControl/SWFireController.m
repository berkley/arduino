//
//  SWFireController.m
//  LEDControl
//
//  Created by Chad Berkley on 7/26/14.
//  Copyright (c) 2014 Chad Berkley. All rights reserved.
//

#import "SWFireController.h"

SWFireController *instance;

@implementation SWFireController

+ (SWFireController*)instance
{
    if(!instance)
        instance = [[SWFireController alloc] init];
    return instance;
}

- (id)init
{
    if(!self)
        self = [super init];
    self.restAddress = @"10.0.1.17:4000";
    self.wsAddress = @"10.0.1.17:4000";
//    self.restAddress = @"10.250.220.224:4000";
//    self.wsAddress = @"10.250.220.224:4001";

    return self;
}

- (void)puff1
{
    [self sendRESTCommand:@"/puff/p1"];
}

- (void)puff2
{
    [self sendRESTCommand:@"/puff/p2"];
}

- (void)puff3
{
    [self sendRESTCommand:@"/puff/p3"];
}

- (void)seq123
{
    [self sendRESTCommand:@"/puff/s123"];
}

- (void)seq321
{
    [self sendRESTCommand:@"/puff/s321"];
}

- (void)seqAll
{
    [self sendRESTCommand:@"/puff/sAll"];
}
@end