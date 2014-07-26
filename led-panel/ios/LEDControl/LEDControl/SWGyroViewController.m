//
//  SWGyroViewController.m
//  LEDControl
//
//  Created by Chad Berkley on 7/24/14.
//  Copyright (c) 2014 Chad Berkley. All rights reserved.
//

#import "SWGyroViewController.h"

@interface SWGyroViewController ()

@end

SRWebSocket *webSocket;

double r;
double g;
double b;

@implementation SWGyroViewController

- (CMMotionManager *)motionManager
{
    CMMotionManager *motionManager = nil;
    
    id appDelegate = [UIApplication sharedApplication].delegate;
    
    if ([appDelegate respondsToSelector:@selector(motionManager)]) {
        motionManager = [appDelegate motionManager];
    }
    
    return motionManager;
}

double chunk = 360.0/255.0;

- (void)startMyMotionDetect
{
    [self.motionManager startDeviceMotionUpdatesToQueue:[[NSOperationQueue alloc] init] withHandler:^(CMDeviceMotion *motion, NSError *error)
    {
         #define degrees(x) (180.0 * x / M_PI)
         double roll = degrees(self.motionManager.deviceMotion.attitude.roll);   //180 < roll > -180
         double yaw  = degrees(self.motionManager.deviceMotion.attitude.yaw);    //180 < pitch > -180
         double pitch = degrees(self.motionManager.deviceMotion.attitude.pitch) * 2;  //90 < pitch > -90
         
         if(roll < 0) roll *= -1;
         if(yaw < 0) yaw *= -1;
         if(pitch < 0) pitch *= -1;
         //         NSLog(@"pitch: %i, b: %i", (int)pitch, (int)(pitch * chunk));
         
         //         NSLog(@"yaw: %f pitch: %f roll: %f chunk: %f", yaw, pitch, roll, chunk);
         
         r = yaw * chunk;
         g = roll * chunk;
         b = pitch * chunk;
        
        NSMutableDictionary *vals = [NSMutableDictionary dictionary];
        [vals setObject:[NSNumber numberWithDouble:r] forKey:@"r"];
        [vals setObject:[NSNumber numberWithDouble:g] forKey:@"g"];
        [vals setObject:[NSNumber numberWithDouble:b] forKey:@"b"];
        [vals setObject:[NSNumber numberWithDouble:yaw] forKey:@"yaw"];
        [vals setObject:[NSNumber numberWithDouble:pitch] forKey:@"pitch"];
        [vals setObject:[NSNumber numberWithDouble:roll] forKey:@"roll"];
        
        [self performSelectorOnMainThread:@selector(updateLabels:) withObject:vals waitUntilDone:NO];
        
         NSLog(@"r: %i, g: %i, b: %i", (int)r, (int)g, (int)b);
        
         NSString *cmd = [NSString stringWithFormat:@"{\"command\":\"latchScreen\", \"screen\":\"%i\", \"r\":\"%i\", \"g\":\"%i\", \"b\":\"%i\"}", (int)screen, (int)r, (int)g, (int)b];
        NSLog(@"cmd: %@", cmd);
         [webSocket send:cmd];
     }];
}

- (void)updateLabels:(NSDictionary*)vals
{
    self.rLabel.text = [NSString stringWithFormat:@"%i", [[vals objectForKey:@"r"] intValue]];
    self.gLabel.text = [NSString stringWithFormat:@"%i", [[vals objectForKey:@"g"] intValue]];
    self.bLabel.text = [NSString stringWithFormat:@"%i", [[vals objectForKey:@"b"] intValue]];
    self.yawLabel.text = [NSString stringWithFormat:@"%i", [[vals objectForKey:@"yaw"] intValue]];
    self.pitchLabel.text = [NSString stringWithFormat:@"%i", [[vals objectForKey:@"pitch"] intValue]];
    self.rollLabel.text = [NSString stringWithFormat:@"%i", [[vals objectForKey:@"roll"] intValue]];
}

#pragma mark - Connection

- (void)connectWebSocket {
    webSocket.delegate = nil;
    webSocket = nil;
    
    NSString *urlString = [NSString stringWithFormat:@"ws://%@", [SWLEDController instance].wsAddress];
    SRWebSocket *newWebSocket = [[SRWebSocket alloc] initWithURL:[NSURL URLWithString:urlString]];
    newWebSocket.delegate = self;
    [newWebSocket open];
}


#pragma mark - SRWebSocket delegate

- (void)webSocketDidOpen:(SRWebSocket *)newWebSocket {
    webSocket = newWebSocket;
    //    [webSocket send:[NSString stringWithFormat:@"Hello from %@", [UIDevice currentDevice].name]];
}

- (void)webSocket:(SRWebSocket *)webSocket didFailWithError:(NSError *)error {
    [self connectWebSocket];
}

- (void)webSocket:(SRWebSocket *)webSocket didCloseWithCode:(NSInteger)code reason:(NSString *)reason wasClean:(BOOL)wasClean
{
    [self connectWebSocket];
}

- (void)webSocket:(SRWebSocket *)webSocket didReceiveMessage:(id)message {
    //    NSLog(@"didReceiveMessage: %@\n", message);
    //    self.messagesTextView.text = [NSString stringWithFormat:@"%@\n%@", self.messagesTextView.text, message];
}

//- (void)sendMessage:(id)sender {
//    [webSocket send:self.messageTextField.text];
//    self.messageTextField.text = nil;
//}

#pragma mark - button selectors

- (IBAction)screen1ButtonTouched:(id)sender {
    screen = 0;
}

- (IBAction)screen2ButtonTouched:(id)sender {
    screen = 1;
}

- (IBAction)screen3ButtonTouched:(id)sender {
    screen = 2;
}

- (IBAction)allButtonTouched:(id)sender {
    screen = 99;
}

#pragma mark - other shit

- (void)viewDidLoad
{
    [super viewDidLoad];
    r = 0;
    g = 0;
    b = 0;
    screen = 99;
    [self connectWebSocket];
    [self startMyMotionDetect];
}

- (void)viewDidDisappear:(BOOL)animated
{
    [self.motionManager stopDeviceMotionUpdates];
    webSocket.delegate = nil;
    webSocket = nil; 
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
