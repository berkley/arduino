//
//  SWKineticEnergyAccumulatorViewController.m
//  LEDControl
//
//  Created by Chad Berkley on 7/30/14.
//  Copyright (c) 2014 Chad Berkley. All rights reserved.
//

#import "SWKineticEnergyAccumulatorViewController.h"
#import "SWFireController.h"

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
int goal;
BOOL running;

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
         [vals setObject:[NSNumber numberWithDouble:goal] forKey:@"goal"];
         [vals setObject:[NSNumber numberWithDouble:currentRow] forKey:@"row"];
         
         
         [self performSelectorOnMainThread:@selector(updateLabels:) withObject:vals waitUntilDone:NO];
         
         //set the accumulated values
//         NSLog(@"accum: %i, goal: %i, currentRow: %i",
//               (int)accumulator, goal, currentRow);
         if(accumulator >= goal)
         {
             goal += (threshold / numRows);
             if(goal >= threshold)
             {
                 NSString *cmd = [NSString stringWithFormat:@"{\"command\":\"latchRowOnScreen\", \"row\":\"%i\", \"screen\":\"%i\", \"r\":\"%i\", \"g\":\"%i\", \"b\":\"%i\"}", 0, (int)screen, (int)r, (int)g, (int)b];
                 
                 [self.webSocket send:cmd];
                 
                 NSLog(@"someone won!");

                 if(screen == 0)
                 {
                     [self performSelectorOnMainThread:@selector(tripplePuff1) withObject:nil waitUntilDone:NO];
                 }
                 else if(screen == 1)
                 {
                     [self performSelectorOnMainThread:@selector(tripplePuff2) withObject:nil waitUntilDone:NO];
                 }
                 else if(screen == 2)
                 {
                     [self performSelectorOnMainThread:@selector(tripplePuff3) withObject:nil waitUntilDone:NO];
                 }
                 else
                 {
                     [self performSelectorOnMainThread:@selector(tripplePuffAll) withObject:nil waitUntilDone:NO];
                 }
                 
//                 goal = threshold / numRows;
//                 accumulator = 0;
//                 currentRow = 0;
//                 
//                 NSString *cmd = [NSString stringWithFormat:@"{\"command\":\"allOff\"}"];
//                 [self.webSocket send:cmd];
                 [self performSelectorOnMainThread:@selector(runOrPause) withObject:nil waitUntilDone:YES];
//                 [self performSelector:@selector(runOrPause) withObject:nil afterDelay:500];
             }
             else
             {
                 currentRow++;
                 NSLog(@"$$$$$ currentRow: %i", (numRows - currentRow));
                 NSString *cmd = [NSString stringWithFormat:@"{\"command\":\"latchRowOnScreen\", \"row\":\"%i\", \"screen\":\"%i\", \"r\":\"%i\", \"g\":\"%i\", \"b\":\"%i\"}", (numRows - (int)currentRow), (int)screen, (int)r, (int)g, (int)b];
                 [self.webSocket send:cmd];
             }
         }
     }];
}

- (void)puff1
{
    [[SWFireController instance] puff1];
}

- (void)tripplePuff1
{
    [self performSelector:@selector(puff1) withObject:nil afterDelay:.1];
    [self performSelector:@selector(puff1) withObject:nil afterDelay:.4];
    [self performSelector:@selector(puff1) withObject:nil afterDelay:.9];
}

- (void)puff2
{
    [[SWFireController instance] puff2];
}

- (void)tripplePuff2
{
    [self performSelector:@selector(puff2) withObject:nil afterDelay:.1];
    [self performSelector:@selector(puff2) withObject:nil afterDelay:.4];
    [self performSelector:@selector(puff2) withObject:nil afterDelay:.9];
}

- (void)puff3
{
    [[SWFireController instance] puff3];
}

- (void)tripplePuff3
{
    [self performSelector:@selector(puff3) withObject:nil afterDelay:.1];
    [self performSelector:@selector(puff3) withObject:nil afterDelay:.4];
    [self performSelector:@selector(puff3) withObject:nil afterDelay:.9];
}

- (void)puffAll
{
    [[SWFireController instance] seqAll];
}

- (void)tripplePuffAll
{
    [self performSelector:@selector(puffAll) withObject:nil afterDelay:.1];
    [self performSelector:@selector(puffAll) withObject:nil afterDelay:.4];
    [self performSelector:@selector(puffAll) withObject:nil afterDelay:.9];
}

- (void)puff123
{
    [[SWFireController instance] seq123];
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
    self.accumLabel.text = [NSString stringWithFormat:@"%i", [[vals objectForKey:@"accumulator"] intValue]];
    self.goalLabel.text = [NSString stringWithFormat:@"%i", [[vals objectForKey:@"goal"] intValue]];
    self.rowLabel.text = [NSString stringWithFormat:@"%i", [[vals objectForKey:@"row"] intValue]];
}

#pragma mark - selectors

- (IBAction)resetButtonTouched:(id)sender {
    [self performSelectorOnMainThread:@selector(reset) withObject:nil waitUntilDone:YES];
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

- (IBAction)pauseButtonTouched:(id)sender {
    [self performSelectorOnMainThread:@selector(runOrPause) withObject:nil waitUntilDone:YES];
}

- (void)runOrPause
{
    if(running)
    {
        [self.motionManager stopDeviceMotionUpdates];
        [self.pauseButton setTitle:@"Go!" forState:UIControlStateNormal];
        [opQueue cancelAllOperations];
//        [opQueue waitUntilAllOperationsAreFinished];
    }
    else
    {
        [self startMyMotionDetect];
        [self.pauseButton setTitle:@"Pause" forState:UIControlStateNormal];
    }
    running = !running;
}

- (void)reset
{
    accumulator = 0;
    prevRow = 0;
    currentRow = 0;
    threshold = 1000;
    goal = threshold / numRows;
    NSString *cmd = [NSString stringWithFormat:@"{\"command\":\"allOff\"}"];
    [self.webSocket send:cmd];
    if(!running)
        [self runOrPause];
}

- (void)viewDidLoad
{
    screen = 99;
    running = YES;
    goal = threshold / numRows;
    [super viewDidLoad];
    [self resetButtonTouched:nil];

    NSLog(@"threshold is: %i", threshold);

}

- (void)viewDidAppear:(BOOL)animated
{
    [super viewDidAppear:animated];
    [self screenAlltouched:nil];
}

- (void)viewDidDisappear:(BOOL)animated
{
    [super viewDidDisappear:animated];
    [self.motionManager stopDeviceMotionUpdates];
    [opQueue cancelAllOperations];
    [opQueue waitUntilAllOperationsAreFinished];
    self.webSocket.delegate = nil;
    self.webSocket = nil;
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
