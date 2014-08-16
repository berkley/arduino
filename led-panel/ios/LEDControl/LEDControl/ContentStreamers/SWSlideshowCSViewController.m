//
//  SWSlideshowCSViewController.m
//  LEDControl
//
//  Created by P. Mark Anderson on 8/9/14.
//  Copyright (c) 2014 Chad Berkley. All rights reserved.
//

#import "SWSlideshowCSViewController.h"

@interface SWSlideshowCSViewController ()
{
    UIImageView *_iv;
    CGFloat _scale;
    CGFloat _scaleDirection;
    CGFloat _angle;
}
@end

@implementation SWSlideshowCSViewController

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    self.closeButton.transform = CGAffineTransformMakeRotation(M_PI_2);
    self.moreButton.transform = CGAffineTransformMakeRotation(M_PI_2);
    
    self.kenView = [[JBKenBurnsView alloc] initWithFrame:self.streamedContentArea.bounds];
    self.kenView.delegate = self;
    [self addContentView:self.kenView];
    
    NSArray *images = @[[UIImage imageNamed:@"ATcellorangekillingacancercellmauve1.jpg"],
                        [UIImage imageNamed:@"anime-eye.png"],
                        [UIImage imageNamed:@"attenae-galaxy.jpg"],
                        [UIImage imageNamed:@"gradient.png"]];
    
    [self.kenView animateWithImages:images
                 transitionDuration:3.0
                       initialDelay:0
                               loop:YES
                        isLandscape:NO];

//    [self addTestGradient];
}

- (void)addTestGradient
{
    _scale = 1.0;
    _scaleDirection = 1.0;
    _iv = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"gradient.png"]];
    [self addContentView:_iv];
    [self animate];
}

- (void)animate {
    if (_scale > 1.0 || _scale < 0.1) {
        _scaleDirection *= -1;
    }
    _scale += (0.0025 * _scaleDirection);
    _angle += M_PI / 200;
    _iv.transform = CGAffineTransformConcat(CGAffineTransformMakeScale(_scale, _scale),
                                            CGAffineTransformMakeRotation(_angle));
    [self performSelector:@selector(animate) withObject:nil afterDelay:1/24];
}

- (IBAction)closeButtonWasTapped:(id)sender {
    [self dismissViewControllerAnimated:YES completion:^{
        [self.webSocket close];
        self.webSocket = nil;
        [self.opQueue cancelAllOperations];
        self.opQueue = nil;
    }];
}

- (IBAction)moreButtonWasTapped:(id)sender {
}

- (void)kenBurns:(JBKenBurnsView *)kenBurns didShowImage:(UIImage *)image atIndex:(NSUInteger)index
{
    
}

- (void)kenBurns:(JBKenBurnsView *)kenBurns didFinishAllImages:(NSArray *)images
{
    
}

- (void)viewDidUnload
{
    [self.kenView stopAnimation];
    [self setKenView:nil];
    
    [super viewDidUnload];
}


@end
