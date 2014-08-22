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
    [self connectWebSocket];
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

- (void)sendBitmap:(NSArray*)bitmap {
    NSError *error = nil;
    
#if 0
    NSString *cmd = [NSString stringWithFormat:@"{\"type\":\"bitmap\", \"bitmap\":\"%@\"}",
                     [self jsonStringify:bitmap error:&error]];
#else
    NSString *cmd = [NSString stringWithFormat:@"{\"command\":\"latchBitmap\", \"bitmap\":\"%@\"}",
                     [self jsonStringify:bitmap error:&error]];
#endif
    
    if (error) {
        NSLog(@"Error stringifying bitmap: %@", error);
    }
    else {
        [_webSocket send:cmd];
    }
}

#pragma mark - Connection

- (void)connectWebSocket {
    _webSocket.delegate = nil;
    _webSocket = nil;
    
//        NSString *urlString = @"ws://127.0.0.1:3001/";
    NSString *urlString = @"ws://10.0.1.17:3001/";
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

@end
