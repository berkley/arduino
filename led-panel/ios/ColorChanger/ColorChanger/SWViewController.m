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
         
         NSString *url = [NSString stringWithFormat:@"http://10.0.1.17:3000/pixel/latch/10/%i/%i/%i", (int)r, (int)g, (int)b];
         NSLog(@"url: %@", url);
         NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:url]
                                                                cachePolicy:NSURLRequestReloadIgnoringLocalAndRemoteCacheData
                                                            timeoutInterval:10];
         
         [request setHTTPMethod: @"GET"];
         
         NSError *requestError;
         NSURLResponse *urlResponse = nil;
         
         [NSURLConnection sendSynchronousRequest:request returningResponse:&urlResponse error:&requestError];
         NSLog(@"requestError: %@", requestError);

     }];
//     startGyroUpdatesToQueue:[[NSOperationQueue alloc] init] withHandler:^(CMGyroData *data, NSError *error)
//     {
//
//         dispatch_async(dispatch_get_main_queue(),
//                        ^{
////                            NSLog(@"motion: %@", data);
//                            
//                            if((data.rotationRate.x < 0 && data.rotationRate.x > -1) &&
//                               (data.rotationRate.y < 0 && data.rotationRate.y > -1) &&
//                               (data.rotationRate.z < 0 && data.rotationRate.z > -1))
//                            {
//                                return;
//                            }
//
//                            double degX = data.rotationRate.x * (M_PI/180.0);
//                            double degY = data.rotationRate.y * (M_PI/180.0);
//                            double degZ = data.rotationRate.z * (M_PI/180.0);
//                            
//                            #define degrees(x) (180.0 * x / M_PI)
//                            double vRoll = degrees(self.motionManager.deviceMotion.attitude.roll);
//                            double vYaw  = degrees(self.motionManager.deviceMotion.attitude.yaw);
//                            double vPitch= degrees(self.motionManager.deviceMotion.attitude.pitch);
//                            
//                            double chunk = 360.0/255.0;
//                            
//                            NSLog(@"degX: %f degY: %f degZ: %f chunk: %f", vRoll, vYaw, vPitch, chunk);
//                            
//                            r += degX * chunk;
//                            g += degY * chunk;
//                            b += degZ * chunk;
//                            
////                            NSLog(@"r: %f g: %f b: %f", r, g, b);
//                            
////                            [self rollOver:r];
////                            [self rollOver:g];
////                            [self rollOver:b];
//                            
////                            CGFloat *r = 
//                        });
//     }
//     ];
    
}

- (double)rollOver:(double)x
{
    if(x > 255)
        return 0;
    return x;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    r = 0;
    g = 0;
    b = 0;
    [self startMyMotionDetect];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
