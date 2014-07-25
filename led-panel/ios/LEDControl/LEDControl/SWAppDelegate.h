//
//  SWAppDelegate.h
//  LEDControl
//
//  Created by Chad Berkley on 7/23/14.
//  Copyright (c) 2014 Chad Berkley. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <CoreMotion/CoreMotion.h>

@interface SWAppDelegate : UIResponder <UIApplicationDelegate>

@property (strong, nonatomic) UIWindow *window;
@property (strong, nonatomic) CMMotionManager *motionManager;

@end
