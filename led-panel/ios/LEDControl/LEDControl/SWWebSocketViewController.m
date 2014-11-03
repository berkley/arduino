//
//  SWWebSocketViewController.m
//  LEDControl
//
//  Created by P. Mark Anderson on 8/9/14.
//  Copyright (c) 2014 Chad Berkley. All rights reserved.
//

#import "SWWebSocketViewController.h"
#import "SWLEDController.h"

@interface SWWebSocketViewController ()

@end

@implementation SWWebSocketViewController

- (void)viewDidLoad
{
    [super viewDidLoad];
}

- (NSString*)jsonStringify:(id)object error:(NSError**)err
{
    if (!object)
    {
        return nil;
    }
    
    NSString *string = nil;
    NSData *data = [NSJSONSerialization dataWithJSONObject:object options:0 error:err];
    
    if (data)
    {
        string = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
    }
    
    return string;
}

- (void)sendBitmap:(NSString*)bitmap {
    NSError *error = nil;
    
#if 0
    NSString *cmd = [NSString stringWithFormat:@"{\"type\":\"bitmap\", \"bitmap\":\"%@\"}",
                     [self jsonStringify:bitmap error:&error]];
#else
//    NSString *cmd = [NSString stringWithFormat:@"{\"command\":\"latchBitmap\", \"bitmap\":\"%@\"}",
//                     [self jsonStringify:bitmap error:&error]];
    NSString *cmd = [NSString stringWithFormat:@"{\"command\":\"latchBitmap\", \"bitmap\":\"%@\"}",
                     bitmap];
#endif
    
    if (error) {
        NSLog(@"Error stringifying bitmap: %@", error);
    }
    else {
//        NSLog(@"cmd:  %@", cmd);
        [_webSocket send:cmd];
    }
}

#pragma mark - Connection

- (void)connectWebSocket {
    _webSocket.delegate = nil;
    _webSocket = nil;
    NSString *ip = [[NSUserDefaults standardUserDefaults] objectForKey:IP_ADDRESS];
    if([ip length] == 0)
    {
        ip = @"192.168.11.30";
        [[NSUserDefaults standardUserDefaults] setObject:ip forKey:IP_ADDRESS];
    }

    NSString *urlString = [NSString stringWithFormat:@"ws://%@:3001/", ip];
    NSLog(@"ws connecting to %@", urlString);
    SRWebSocket *newWebSocket = [[SRWebSocket alloc] initWithURL:[NSURL URLWithString:urlString]];
    newWebSocket.delegate = self;
    [newWebSocket open];
}


#pragma mark - SRWebSocket delegate

- (void)webSocketDidOpen:(SRWebSocket *)newWebSocket {
    NSLog(@"socket open");
    _webSocket = newWebSocket;
    //    [webSocket send:[NSString stringWithFormat:@"Hello from %@", [UIDevice currentDevice].name]];
}

- (void)webSocket:(SRWebSocket *)webSocket didFailWithError:(NSError *)error {
    NSLog(@"socket fail: %@", error);
    if (self.webSocket) {
        [self connectWebSocket];
    }
}

- (void)webSocket:(SRWebSocket *)webSocket didCloseWithCode:(NSInteger)code reason:(NSString *)reason wasClean:(BOOL)wasClean
{
    NSLog(@"socket close: %@", reason);
    if (self.webSocket) {
        [self connectWebSocket];
    }
}

- (void)webSocket:(SRWebSocket *)webSocket didReceiveMessage:(id)message {
//    NSLog(@"didReceiveMessage: %@\n", message);
    //    self.messagesTextView.text = [NSString stringWithFormat:@"%@\n%@", self.messagesTextView.text, message];
}

//- (void)sendMessage:(id)sender {
//    [webSocket send:self.messageTextField.text];
//    self.messageTextField.text = nil;
//}

- (void)viewDidAppear:(BOOL)animated
{
    [super viewDidAppear:animated];
    [self connectWebSocket];
}

- (void)viewWillDisappear:(BOOL)animated
{
    [super viewWillDisappear:animated];
    self.webSocket.delegate = nil;
    [self.webSocket close];
}


@end
