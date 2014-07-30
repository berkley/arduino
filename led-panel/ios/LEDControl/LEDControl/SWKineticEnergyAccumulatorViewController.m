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
int numRows = 24;
int prevRow;
int currentRow;

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
         
         //set the accumulated values
         int accumChunk = 1;
         int breakPoint = threshold / numRows;
         NSLog(@"accumChunk: %i", accumChunk);
         NSLog(@"breakPoint: %i", breakPoint);
         int newPosition = accumulator * 2;
         NSLog(@"newPos: %i", newPosition);
         if(newPosition >= (breakPoint * currentRow))
         {
             prevRow = currentRow;
             currentRow = newPosition;
             NSLog(@"currentRow: %i", currentRow);
             NSString *cmd = [NSString stringWithFormat:@"{\"command\":\"latchRowOnScreen\", \"row\":\"%i\", \"screen\":\"%i\", \"r\":\"%i\", \"g\":\"%i\", \"b\":\"%i\"}", (int)currentRow, (int)screen, (int)r, (int)g, (int)b];
             //        NSLog(@"cmd: %@", cmd);
             [self.webSocket send:cmd];
             
         }
         
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
    prevRow = 0;
    currentRow = 0;
    threshold = [self.thresholdTextField.text intValue];
    NSString *cmd = [NSString stringWithFormat:@"{\"command\":\"allOff\"}"];
    //        NSLog(@"cmd: %@", cmd);
    [self.webSocket send:cmd];
}

- (IBAction)thresholdValueChanged:(id)sender {
    threshold = [self.thresholdTextField.text intValue];
    NSLog(@"threshold is: %i", threshold);
}

- (IBAction)screen1Touched:(id)sender {
    screen = 0;
    [self.screen1Button setTitleColor:[UIColor redColor] forState:UIControlStateNormal];
    [self.screen2Button setTitleColor:[UIColor blueColor] forState:UIControlStateNormal];
    [self.screen3Button setTitleColor:[UIColor blueColor] forState:UIControlStateNormal];
    [self.screenAllButton setTitleColor:[UIColor blueColor] forState:UIControlStateNormal];
}

- (IBAction)screen2Touched:(id)sender {
    screen = 1;
    [self.screen1Button setTitleColor:[UIColor blueColor] forState:UIControlStateNormal];
    [self.screen2Button setTitleColor:[UIColor redColor] forState:UIControlStateNormal];
    [self.screen3Button setTitleColor:[UIColor blueColor] forState:UIControlStateNormal];
    [self.screenAllButton setTitleColor:[UIColor blueColor] forState:UIControlStateNormal];
}

- (IBAction)screen3Touched:(id)sender {
    screen = 2;
    [self.screen1Button setTitleColor:[UIColor blueColor] forState:UIControlStateNormal];
    [self.screen2Button setTitleColor:[UIColor blueColor] forState:UIControlStateNormal];
    [self.screen3Button setTitleColor:[UIColor redColor] forState:UIControlStateNormal];
    [self.screenAllButton setTitleColor:[UIColor blueColor] forState:UIControlStateNormal];
}

- (IBAction)screenAlltouched:(id)sender {
    screen = 99;
    [self.screen1Button setTitleColor:[UIColor blueColor] forState:UIControlStateNormal];
    [self.screen2Button setTitleColor:[UIColor blueColor] forState:UIControlStateNormal];
    [self.screen3Button setTitleColor:[UIColor blueColor] forState:UIControlStateNormal];
    [self.screenAllButton setTitleColor:[UIColor redColor] forState:UIControlStateNormal];
}

- (void)viewDidLoad
{
    [super viewDidLoad];
}

- (void)viewDidAppear:(BOOL)animated
{
    [super viewDidAppear:animated];
    screen = 0;
    [self resetButtonTouched:nil];
    NSLog(@"threshold is: %i", threshold);
}

- (void)viewDidDisappear:(BOOL)animated
{
    [super viewDidDisappear:animated];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
