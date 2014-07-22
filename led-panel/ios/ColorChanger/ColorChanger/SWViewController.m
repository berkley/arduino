//
//  SWViewController.m
//  ColorChanger
//
//  Created by Chad Berkley on 7/19/14.
//  Copyright (c) 2014 Chad Berkley. All rights reserved.
//

#import "SWViewController.h"
#import <CoreMotion/CoreMotion.h>

@interface SWViewController ()

@end

@implementation SWViewController

SRWebSocket *webSocket;

double r;
double g;
double b;

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
    [self.motionManager
//     startAccelerometerUpdatesToQueue:[[NSOperationQueue alloc] init]
//     withHandler:^(CMAccelerometerData *data, NSError *error)
     startDeviceMotionUpdatesToQueue:[[NSOperationQueue alloc] init] withHandler:^(CMDeviceMotion *motion, NSError *error) {
        #define degrees(x) (180.0 * x / M_PI)
         double roll = degrees(self.motionManager.deviceMotion.attitude.roll);   //180 < roll > -180
         double yaw  = degrees(self.motionManager.deviceMotion.attitude.yaw);    //180 < pitch > -180
         double pitch = degrees(self.motionManager.deviceMotion.attitude.pitch) * 2;  //90 < pitch > -90
         
         if(roll < 0) roll += 180.0;
         if(yaw < 0) yaw += 180.0;
         if(pitch < 0) pitch += 180.0;
//         NSLog(@"pitch: %i, b: %i", (int)pitch, (int)(pitch * chunk));
         
//         NSLog(@"yaw: %f pitch: %f roll: %f chunk: %f", yaw, pitch, roll, chunk);
         
         r = yaw * chunk;
         g = roll * chunk;
         b = pitch * chunk;
         
         NSLog(@"r: %i, g: %i, b: %i", (int)r, (int)g, (int)b);
         
//         NSString *url = [NSString stringWithFormat:@"http://10.0.1.17:3000/screen/latch/0/%i/%i/%i", (int)r, (int)g, (int)b];
//         NSLog(@"url: %@", url);
//         NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:url]
//                                                                cachePolicy:NSURLRequestReloadIgnoringLocalAndRemoteCacheData
//                                                            timeoutInterval:10];
//         
//         [request setHTTPMethod: @"GET"];
//         
//         NSError *requestError;
//         NSURLResponse *urlResponse = nil;
//         
//         [NSURLConnection sendSynchronousRequest:request returningResponse:&urlResponse error:&requestError];
//         NSLog(@"requestError: %@", requestError);
         
         NSString *cmd = [NSString stringWithFormat:@"{\"command\":\"latchScreen\", \"screen\":\"0\", \"r\":\"%i\", \"g\":\"%i\", \"b\":\"%i\"}", (int)r, (int)g, (int)b];
         [webSocket send:cmd];

     }];
}

#pragma mark - Connection

- (void)connectWebSocket {
    webSocket.delegate = nil;
    webSocket = nil;
    
    NSString *urlString = @"ws://10.0.1.17:3001";
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
    NSLog(@"didReceiveMessage: %@\n", message);
//    self.messagesTextView.text = [NSString stringWithFormat:@"%@\n%@", self.messagesTextView.text, message];
}

//- (void)sendMessage:(id)sender {
//    [webSocket send:self.messageTextField.text];
//    self.messageTextField.text = nil;
//}

- (void)viewDidLoad
{
    [super viewDidLoad];
    r = 0;
    g = 0;
    b = 0;
    [self connectWebSocket];
    [self startMyMotionDetect];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
