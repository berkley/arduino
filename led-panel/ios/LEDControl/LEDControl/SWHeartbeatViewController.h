//
//  SWHeartbeatViewController.h
//  LEDControl
//
//  Created by Chad Berkley on 8/13/14.
//  Copyright (c) 2014 Chad Berkley. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface SWHeartbeatViewController : UIViewController
@property (weak, nonatomic) IBOutlet UISlider *redSlider;
@property (weak, nonatomic) IBOutlet UISlider *greenSlider;
@property (weak, nonatomic) IBOutlet UISlider *blueSlider;

@end
