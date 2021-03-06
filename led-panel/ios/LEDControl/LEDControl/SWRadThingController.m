//
//  SWRadThingController.m
//  LEDControl
//
//  Created by Chad Berkley on 7/26/14.
//  Copyright (c) 2014 Chad Berkley. All rights reserved.
//

#import "SWRadThingController.h"

@implementation SWRadThingController

- (void)updateIp
{
    self.ip = [[NSUserDefaults standardUserDefaults] objectForKey:IP_ADDRESS];
    if(self.ip == nil)
    {
        self.ip = @"10.0.1.17";
    }
}

- (void)sendRESTCommand:(NSString*)command
{
    NSString *url = [NSString stringWithFormat:@"http://%@%@", self.restAddress, command];
    NSLog(@"url: %@", url);
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:url]
                                                           cachePolicy:NSURLRequestReloadIgnoringLocalAndRemoteCacheData
                                                       timeoutInterval:10];
    
    [request setHTTPMethod: @"GET"];
    
    NSError *requestError;
    NSURLResponse *urlResponse = nil;
    
    [NSURLConnection sendSynchronousRequest:request returningResponse:&urlResponse error:&requestError];
    NSLog(@"requestError: %@", requestError);
}


@end
