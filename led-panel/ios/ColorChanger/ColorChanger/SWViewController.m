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

- (void)startMyMotionDetect
{
    [self.motionManager
//     startAccelerometerUpdatesToQueue:[[NSOperationQueue alloc] init]
//     withHandler:^(CMAccelerometerData *data, NSError *error)
     startGyroUpdatesToQueue:[[NSOperationQueue alloc] init] withHandler:^(CMGyroData *data, NSError *error)
     {
         
         dispatch_async(dispatch_get_main_queue(),
                        ^{
//                            NSLog(@"motion: %@", data);
                            
                            if((data.rotationRate.x < 0 && data.rotationRate.x > -1) &&
                               (data.rotationRate.y < 0 && data.rotationRate.y > -1) &&
                               (data.rotationRate.z < 0 && data.rotationRate.z > -1))
                            {
                                return;
                            }

                            double degX = data.rotationRate.x * (M_PI/180.0);
                            double degY = data.rotationRate.y * (M_PI/180.0);
                            double degZ = data.rotationRate.z * (M_PI/180.0);
                            double chunk = 360.0/255.0;
                            
                            NSLog(@"degX: %f degY: %f degZ: %f chunk: %f", degX, degY, degZ, chunk);
                            
                            r += degX * chunk;
                            g += degY * chunk;
                            b += degZ * chunk;
                            
//                            NSLog(@"r: %f g: %f b: %f", r, g, b);
                            
//                            [self rollOver:r];
//                            [self rollOver:g];
//                            [self rollOver:b];
                            
//                            CGFloat *r = 
//                            NSString *url = @"http://10.0.1.17:3000/pixel/latch/10/10/"
//                            NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:serverAddress]
//                                                                                   cachePolicy:NSURLRequestReloadIgnoringLocalAndRemoteCacheData
//                                                                               timeoutInterval:10];
//                            
//                            [request setHTTPMethod: @"GET"];
//                            
//                            NSError *requestError;
//                            NSURLResponse *urlResponse = nil;
//                            
//                            
//                            NSData *response1 = [NSURLConnection sendSynchronousRequest:request returningResponse:&urlResponse error:&requestError];
                        });
     }
     ];
    
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
