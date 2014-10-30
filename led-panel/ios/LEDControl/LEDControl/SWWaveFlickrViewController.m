//
//  SWWaveFlickrViewController.m
//  LEDControl
//
//  Created by Chad Berkley on 8/15/14.
//  Copyright (c) 2014 Chad Berkley. All rights reserved.
//

#import "SWWaveFlickrViewController.h"

@interface SWWaveFlickrViewController ()

@end

@implementation SWWaveFlickrViewController


- (void)viewDidLoad
{
    [super viewDidLoad];
    [self connectWebSocket];
    _panGestureRecognizer = [[UIPanGestureRecognizer alloc] initWithTarget:self action:@selector(panGestureHappened:)];
    _swipeGestureRecognizer = [[UISwipeGestureRecognizer alloc] initWithTarget:self action:@selector(swipeGestureHappened:)];
    _panGestureRecognizer.delegate = self;
    _swipeGestureRecognizer.delegate = self;
    _swipeGestureRecognizer.direction = UISwipeGestureRecognizerDirectionUp;
//    _tapGestureRecognizer = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(tapGestureHappened:)];
//    _tapGestureRecognizer.delegate = self;
    [_mainView addGestureRecognizer:_swipeGestureRecognizer];
    [_mainView addGestureRecognizer:_panGestureRecognizer];
//    [_mainView addGestureRecognizer:_tapGestureRecognizer];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
}

#pragma mark - gesture handling 

- (IBAction)panGestureHappened:(id)sender {
    UIPanGestureRecognizer *pgr = (UIPanGestureRecognizer*)sender;
//    NSLog(@"translation: %f, %f", [pgr translationInView:self.mainView].x, [pgr translationInView:self.view].y);
    NSLog(@"velocity: %f, %f", [pgr velocityInView:self.mainView].x, [pgr velocityInView:self.view].y);
//    NSLog(@"location in view: %f, %f", [pgr locationInView:self.mainView].x, [pgr locationInView:self.mainView].y);
    //bucket sizes
    NSInteger height = self.mainView.frame.size.height;
    CGFloat percentPerRow = (CGFloat)[SWLEDController instance].numRows / (CGFloat)height;
    //what bucket are we in?
    NSInteger y = [pgr locationInView:self.mainView].y;
    
    CGFloat percent = (CGFloat)y / (CGFloat)height;
    CGFloat row = percent / percentPerRow;
//    NSLog(@"pecent: %f", percent);
//    NSLog(@"percent per row: %f", percentPerRow);
//    NSLog(@"row: %i", (int)row);
    
    NSInteger r = 255;
    NSInteger g = 0;
    NSInteger b = 0;

    NSString *cmd = [NSString stringWithFormat:@"{\"command\":\"drawWaveAtRow\", \"row\":\"%i\", \"r\":\"%i\", \"g\":\"%i\", \"b\":\"%i\"}", (int)row, (int)r, (int)g, (int)b];
    NSLog(@"cmd: %@", cmd);
    [_webSocket send:cmd];
}

- (IBAction)tapGestureHappened:(id)sender {
    NSLog(@"tap happened");
}

- (IBAction)senderswipeGestureHappened:(id)sender {
    
}

#pragma mark - Connection

- (void)connectWebSocket {
    _webSocket.delegate = nil;
    _webSocket = nil;
    
    NSString *urlString = [NSString stringWithFormat:@"ws://%@", [SWLEDController instance].wsAddress];
    SRWebSocket *newWebSocket = [[SRWebSocket alloc] initWithURL:[NSURL URLWithString:urlString]];
    newWebSocket.delegate = self;
    [newWebSocket open];
}


#pragma mark - SRWebSocket delegate

- (void)webSocketDidOpen:(SRWebSocket *)newWebSocket {
    _webSocket = newWebSocket;
}

- (void)webSocket:(SRWebSocket *)webSocket didFailWithError:(NSError *)error {
    [self connectWebSocket];
}

- (void)webSocket:(SRWebSocket *)webSocket didCloseWithCode:(NSInteger)code reason:(NSString *)reason wasClean:(BOOL)wasClean
{
    [self connectWebSocket];
}

- (void)webSocket:(SRWebSocket *)webSocket didReceiveMessage:(id)message
{
    
}

@end
