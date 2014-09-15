//
//  SWSlideshowCSViewController.m
//  LEDControl
//
//  Created by P. Mark Anderson on 8/9/14.
//  Copyright (c) 2014 Chad Berkley. All rights reserved.
//

#import "SWSlideshowCSViewController.h"
#import <MobileCoreServices/UTCoreTypes.h>
#import <AssetsLibrary/AssetsLibrary.h>

@interface SWSlideshowCSViewController ()
{
    UIImageView *_iv;
    CGFloat _scale;
    CGFloat _scaleDirection;
    CGFloat _angle;
}
@end

@implementation SWSlideshowCSViewController

- (void)newKenViewWithImages:(NSArray*)images
{
    if (self.kenView) {
        [self.kenView removeFromSuperview];
        self.kenView = nil;
    }

    self.kenView = [[JBKenBurnsView alloc] initWithFrame:self.streamedContentArea.bounds];
    self.kenView.delegate = self;
    [self addContentView:self.kenView];
    
    [self.kenView animateWithImages:images
                 transitionDuration:3.0
                       initialDelay:0
                               loop:YES
                        isLandscape:YES];
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    
//    self.closeButton.transform = CGAffineTransformMakeRotation(M_PI_2);
//    self.moreButton.transform = CGAffineTransformMakeRotation(M_PI_2);
    
    NSArray *images = @[[UIImage imageNamed:@"ATcellorangekillingacancercellmauve1.jpg"],
                        [UIImage imageNamed:@"anime-eye.png"],
                        [UIImage imageNamed:@"attenae-galaxy.jpg"],
                        [UIImage imageNamed:@"gradient.png"]];

    [self newKenViewWithImages:images];
    
//    [self addTestGradient];

    
    if (![UIImagePickerController isSourceTypeAvailable:UIImagePickerControllerSourceTypeSavedPhotosAlbum]) {
        self.moreButton.hidden = YES;
    }
}

- (void)viewDidAppear:(BOOL)animated
{
    [super viewDidAppear:animated];
    
    static BOOL first = false;
    
    if (first) {
        [self showImagePicker];
    }

    first = false;
    [self startCapturing];
}

- (IBAction)showImagePicker
{
	ELCImagePickerController *elcPicker = [[ELCImagePickerController alloc] initImagePicker];
    
    elcPicker.maximumImagesCount = 100; //Set the maximum number of images to select to 100
    elcPicker.returnsOriginalImage = YES; //Only return the fullScreenImage, not the fullResolutionImage
    elcPicker.returnsImage = YES; //Return UIimage if YES. If NO, only return asset location information
    elcPicker.onOrder = YES; //For multiple image selection, display and return order of selected images
    elcPicker.mediaTypes = @[(NSString *)kUTTypeImage]; //Supports image and movie types
    //    elcPicker.mediaTypes = @[(NSString *)kUTTypeImage, (NSString *)kUTTypeMovie]; //Supports image and movie types
    
	elcPicker.imagePickerDelegate = self;
    
    [self presentViewController:elcPicker animated:YES completion:nil];
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
    self.closing = YES;
    
    [self dismissViewControllerAnimated:YES completion:^{
        [self.webSocket close];
        self.webSocket = nil;
        [self.opQueue cancelAllOperations];
        self.opQueue = nil;
    }];
}

- (IBAction)moreButtonWasTapped:(id)sender
{
    [self showImagePicker];
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

#pragma mark - UIImagePickerControllerDelegate

//- (void)imagePickerController:(UIImagePickerController *)picker didFinishPickingMediaWithInfo:(NSDictionary *)info
//{
//    UIImage *image = [info valueForKey:UIImagePickerControllerOriginalImage];
//    [self.capturedImages addObject:image];
//    [self finishAndUpdate];
//}


- (void)elcImagePickerController:(ELCImagePickerController *)picker didFinishPickingMediaWithInfo:(NSArray *)info
{
    NSMutableArray *images = [NSMutableArray arrayWithCapacity:[info count]];

	for (NSDictionary *dict in info) {
        if ([dict objectForKey:UIImagePickerControllerMediaType] == ALAssetTypePhoto){
            if ([dict objectForKey:UIImagePickerControllerOriginalImage]){
                [images addObject:[dict objectForKey:UIImagePickerControllerOriginalImage]];
            }
            else {
                NSLog(@"UIImagePickerControllerReferenceURL = %@", dict);
            }
        }
        else if ([dict objectForKey:UIImagePickerControllerMediaType] == ALAssetTypeVideo){
            if ([dict objectForKey:UIImagePickerControllerOriginalImage]){
                EYLargePhoto *photo = [[EYLargePhoto alloc] init];
                photo.thumb = [dict objectForKey:UIImagePickerControllerOriginalImage];
                UIImage* image = photo.thumb;
                [images addObject:image];
            }
            else {
                NSLog(@"UIImagePickerControllerReferenceURL = %@", dict);
            }
        } else {
            NSLog(@"Uknown asset type");
        }
    }
    
    self.chosenImages = images;
    
    [self dismissViewControllerAnimated:YES completion:NULL];
    
    if ([self.chosenImages count] > 0)
    {
        [self newKenViewWithImages:self.chosenImages];
        
        // To be ready to start again, clear the captured images array.
        [self.chosenImages removeAllObjects];
    }
}

- (void)elcImagePickerControllerDidCancel:(ELCImagePickerController *)picker
{
    [self dismissViewControllerAnimated:YES completion:nil];
}

@end
