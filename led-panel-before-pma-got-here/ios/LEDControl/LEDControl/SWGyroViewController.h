//
//  SWGyroViewController.h
//  LEDControl
//
//  Created by Chad Berkley on 7/24/14.
//  Copyright (c) 2014 Chad Berkley. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <CoreMotion/CoreMotion.h>
#import <SocketRocket/SRWebSocket.h>
#import "SWLEDController.h"

#define chunk 360.0/255.0
#define degrees(x) (180.0 * x / M_PI)

@interface SWGyroViewController : UIViewController <SRWebSocketDelegate>
{
    NSInteger screen;
    NSOperationQueue *opQueue;
}

@property (weak, nonatomic) IBOutlet UILabel *yawLabel;
@property (weak, nonatomic) IBOutlet UILabel *pitchLabel;
@property (weak, nonatomic) IBOutlet UILabel *rollLabel;

@property (weak, nonatomic) IBOutlet UILabel *rLabel;
@property (weak, nonatomic) IBOutlet UILabel *gLabel;
@property (weak, nonatomic) IBOutlet UILabel *bLabel;
@property (strong, nonatomic) SRWebSocket *webSocket;

- (CMMotionManager *)motionManager;
- (void)startMyMotionDetect;


@end
