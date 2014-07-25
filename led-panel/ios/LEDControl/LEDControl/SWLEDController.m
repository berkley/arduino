//
//  SWLEDController.m
//  LEDControl
//
//  Created by Chad Berkley on 7/24/14.
//  Copyright (c) 2014 Chad Berkley. All rights reserved.
//

#import "SWLEDController.h"

NSString *serverAddress;
SWLEDController *controller;

@implementation SWLEDController

+ (SWLEDController*)instance
{
    if(controller == nil)
    {
        controller = [[SWLEDController alloc] init];
    }
    return controller;
}

- (id)init
{
    if(!self)
        self = [super init];
    
    serverAddress = @"10.0.1.17:3000";
    return self;
}

- (void)sendRESTCommand:(NSString*)command
{
         NSString *url = [NSString stringWithFormat:@"http://%@%@", serverAddress, command];
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

- (void)setPixel:(NSInteger)pixel red:(NSInteger)r green:(NSInteger)g blue:(NSInteger)b
{
    NSString *cmd = [NSString stringWithFormat:@"/pixel/set/%i/%i/%i/%i", pixel, r, g, b];
    [self sendRESTCommand:cmd];
}

- (void)setPixelx:(NSInteger)x y:(NSInteger)y red:(NSInteger)r green:(NSInteger)g blue:(NSInteger)b
{
    NSString *cmd = [NSString stringWithFormat:@"/pixel/set/%i/%i/%i/%i/%i", x, y, r, g, b];
    [self sendRESTCommand:cmd];
}

- (void)setRow:(NSInteger)row red:(NSInteger)r green:(NSInteger)g blue:(NSInteger)b
{
    NSString *cmd = [NSString stringWithFormat:@"/row/set/%i/%i/%i/%i", row, r, g, b];
    [self sendRESTCommand:cmd];
}

- (void)setCol:(NSInteger)col red:(NSInteger)r green:(NSInteger)g blue:(NSInteger)b
{
    NSString *cmd = [NSString stringWithFormat:@"/col/set/%i/%i/%i/%i", col, r, g, b];
    [self sendRESTCommand:cmd];
}

- (void)setScreen:(NSInteger)screen red:(NSInteger)r green:(NSInteger)g blue:(NSInteger)b
{
    NSString *cmd = [NSString stringWithFormat:@"/screen/set/%i/%i/%i/%i", screen, r, g, b];
    [self sendRESTCommand:cmd];
}

- (void)setAllOff
{
    NSString *cmd = [NSString stringWithFormat:@"/pixel/set/off"];
    [self sendRESTCommand:cmd];
}

- (void)latch
{
    NSString *cmd = [NSString stringWithFormat:@"/latch"];
    [self sendRESTCommand:cmd];
}

@end
