//
//  SWKineticEnergyAccumulatorViewController.m
//  LEDControl
//
//  Created by Chad Berkley on 7/30/14.
//  Copyright (c) 2014 Chad Berkley. All rights reserved.
//

#import "SWKineticEnergyAccumulatorViewController.h"

@interface SWKineticEnergyAccumulatorViewController ()

@end

double r;
double g;
double b;
double accumulator;
int threshold;

@implementation SWKineticEnergyAccumulatorViewController

- (void)startMyMotionDetect
{
    [self.motionManager startDeviceMotionUpdatesToQueue:opQueue withHandler:^(CMDeviceMotion *motion, NSError *error)
     {

         double roll = degrees(self.motionManager.deviceMotion.attitude.roll);   //180 < roll > -180
         double yaw  = degrees(self.motionManager.deviceMotion.attitude.yaw);    //180 < pitch > -180
         double pitch = degrees(self.motionManager.deviceMotion.attitude.pitch) * 2;  //90 < pitch > -90
         
         double accelX = self.motionManager.deviceMotion.userAcceleration.x * self.motionManager.deviceMotion.gravity.x;
         double accelY = self.motionManager.deviceMotion.userAcceleration.y * self.motionManager.deviceMotion.gravity.y;
         double accelZ = self.motionManager.deviceMotion.userAcceleration.z * self.motionManager.deviceMotion.gravity.z;
         
         if(accelX < 0) accelX *= -1;
         if(accelY < 0) accelY *= -1;
         if(accelZ < 0) accelZ *= -1;

         if(roll < 0) roll *= -1;
         if(yaw < 0) yaw *= -1;
         if(pitch < 0) pitch *= -1;
         
//         NSLog(@"accelX: %f accelY: %f accelZ: %f", accelX, accelY, accelZ);
         
         
         accumulator += accelX + accelY + accelZ;
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
         [vals setObject:[NSNumber numberWithDouble:accelX] forKey:@"accelX"];
         [vals setObject:[NSNumber numberWithDouble:accelY] forKey:@"accelY"];
         [vals setObject:[NSNumber numberWithDouble:accelZ] forKey:@"accelZ"];
         [vals setObject:[NSNumber numberWithDouble:accumulator] forKey:@"accumulator"];
         
         
         [self performSelectorOnMainThread:@selector(updateLabels:) withObject:vals waitUntilDone:NO];
         
//         NSLog(@"r: %i, g: %i, b: %i", (int)r, (int)g, (int)b);
         
         NSString *cmd = [NSString stringWithFormat:@"{\"command\":\"accumRow\", \"value\":\"%i\", \"screen\":\"%i\", \"r\":\"%i\", \"g\":\"%i\", \"b\":\"%i\"}", (int)accumulator, (int)screen, (int)r, (int)g, (int)b];
         //        NSLog(@"cmd: %@", cmd);
         [self.webSocket send:cmd];
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
    self.accelXLabel.text = [NSString stringWithFormat:@"%f", [[vals objectForKey:@"accelX"] floatValue]];
    self.accelYLabel.text = [NSString stringWithFormat:@"%f", [[vals objectForKey:@"accelY"] floatValue]];
    self.accelZLabel.text = [NSString stringWithFormat:@"%f", [[vals objectForKey:@"accelZ"] floatValue]];
    self.accumLabel.text = [NSString stringWithFormat:@"%f", [[vals objectForKey:@"accumulator"] floatValue]];
}

#pragma mark - selectors

- (IBAction)resetButtonTouched:(id)sender {
    accumulator = 0;
}

- (IBAction)thresholdValueChanged:(id)sender {
    threshold = [self.thresholdTextField.text intValue];
    NSLog(@"threshold is: %i", threshold);
}

- (void)viewDidLoad
{
    [super viewDidLoad];
}

- (void)viewDidAppear:(BOOL)animated
{
    [super viewDidAppear:animated];
    accumulator = 0;
    threshold = [self.thresholdTextField.text intValue];
    NSLog(@"threshold is: %i", threshold);
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
