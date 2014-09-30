//
//  SWContentStreamViewController.m
//  LEDControl
//
//  Created by P. Mark Anderson on 8/9/14.
//  Copyright (c) 2014 Chad Berkley. All rights reserved.
//

#import "SWContentStreamViewController.h"

<<<<<<< HEAD
const CGFloat FPS = 18;  // 24 is good
const short WIDTH = 48;
const short HEIGHT = 24;
const short X_STEP = 10;
const short Y_STEP = 10;
=======
const CGFloat FPS = 20;  // 24 is good
>>>>>>> 16750a0899500cbfe690fdd425778a06c9a8b235

@interface SWContentStreamViewController ()
{
    NSTimeInterval _lastCaptureAt;
    CGFloat _left;
    CGFloat _top;

    CGFloat _xStep;
    CGFloat _yStep;
    size_t _wFrame;
    size_t _hFrame;
    dispatch_queue_t _queue;

    unsigned char *_frameData;
    CGContextRef _cgctx;
    CGColorSpaceRef _colorSpace;
    void *_bitmapData;
}
@end

@implementation SWContentStreamViewController

- (void)viewDidLoad
{
    [super viewDidLoad];

    CGFloat w = 480;
    CGFloat h = 240;
    CGFloat x = (self.view.bounds.size.width - w) / 2;
    CGFloat y = (self.view.bounds.size.height - h) / 2;


    self.streamedContentArea = [[UIView alloc] initWithFrame:CGRectMake(x, y, w, h)];
    self.streamedContentArea.clipsToBounds = YES;
    self.streamedContentArea.backgroundColor = [UIColor blackColor];

    [self.view addSubview:self.streamedContentArea];
    
    _left = self.streamedContentArea.frame.origin.x + self.streamedContentArea.frame.size.width;
    _top = self.streamedContentArea.frame.origin.y;
    
    self.opQueue = [[NSOperationQueue alloc] init];
    
    _frameData = NULL;
    _cgctx = NULL;
    _bitmapData = NULL;
    _colorSpace = NULL;
}

- (void)viewDidAppear:(BOOL)animated
{
    [super viewDidAppear:animated];
    
//    [self nextFrame];
}

- (void)viewWillDisappear:(BOOL)animated
{
    [super viewWillDisappear:animated];
    
    if (_colorSpace != NULL) {
        CGColorSpaceRelease( _colorSpace );
    }
    

}


- (void)startCapturing
{
    _lastCaptureAt = CACurrentMediaTime();
    _queue = dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_HIGH, 0);
    
    NSLog(@"start capture");

    [self nextFrame];
}

- (void)addContentView:(UIView*)v
{
    [self.streamedContentArea addSubview:v];
}

natural_t lastMem;

- (void)nextFrame
{
    

#if 1
    dispatch_async(_queue, ^{
//        natural_t curMem = freeMemory();
//        natural_t memDiff = (lastMem - curMem);
//        lastMem = curMem;
//        NSLog(@"                      mem: %i    %i", memDiff, curMem);
//        NSLog(@" -- nextFrame -- %@", [NSThread currentThread]);
        [self captureFrame];
    });
#else
    while(1){
        [self captureFrame];
    }
#endif
}

- (void)frameCaptureComplete:(NSString*)bitmap
{
//    NSLog(@" XXX complete XXX");
    
    [self sendBitmap:bitmap];
<<<<<<< HEAD
    [self nextFrame];
=======
   [self performSelectorInBackground:@selector(captureFrame) withObject:nil];
>>>>>>> 16750a0899500cbfe690fdd425778a06c9a8b235
}

- (void)captureFrame
{
    if (self.closing) {
        return;
    }
    
    CFTimeInterval now = CACurrentMediaTime();
    CFTimeInterval delta = (now - _lastCaptureAt);
    CFTimeInterval wait = ( (1/FPS) - delta);
//    NSLog(@"delta %.4f, wait %.4f\n\n", delta, wait);
    
    if (wait > 0.0001) {
        [NSThread sleepForTimeInterval:wait];
    }
    
    _lastCaptureAt = CACurrentMediaTime();
    
<<<<<<< HEAD
//    CaptureAndSendBitmapOperation *op = [[CaptureAndSendBitmapOperation alloc] init];
//    op.delegate = self;
//    op.view = self.streamedContentArea;
//    op.left = _left;
//    op.top = _top;

    [self go];
//    [_opQueue addOperation:op];
    
    
}

#import <mach/mach.h>
#import <mach/mach_host.h>

natural_t  freeMemory(void) {
    mach_port_t           host_port = mach_host_self();
    mach_msg_type_number_t   host_size = sizeof(vm_statistics_data_t) / sizeof(integer_t);
    vm_size_t               pagesize;
    vm_statistics_data_t     vm_stat;
    
    host_page_size(host_port, &pagesize);
    
    if (host_statistics(host_port, HOST_VM_INFO, (host_info_t)&vm_stat, &host_size) != KERN_SUCCESS) NSLog(@"Failed to fetch vm statistics");
    
//    natural_t   mem_used = (vm_stat.active_count + vm_stat.inactive_count + vm_stat.wire_count) * pagesize;
    natural_t   mem_free = vm_stat.free_count * pagesize;
//    natural_t   mem_total = mem_used + mem_free;
    
    return mem_free;
}





///////////////
//typedef void (*CGBitmapContextReleaseDataCallback)(void *releaseInfo,
//void *data);

void bitmapContextReleaseCallback(void *releaseInfo,
                                                                void *data) {
//    NSLog(@"bitmap context released!");
//    return NULL;
}

- (void)go {
    unsigned char *frameData = NULL;
    NSMutableString *bitmap = nil;
    CGContextRef cgctx = NULL;
    CGImageRef inImage;
    

    @try {
        
        UIImage *image = nil;
        UIGraphicsBeginImageContext(self.streamedContentArea.bounds.size);
        CGContextRef ctxt = UIGraphicsGetCurrentContext();
        
        if (ctxt != NULL) {
            [self.streamedContentArea.layer renderInContext:ctxt];
            image = UIGraphicsGetImageFromCurrentImageContext();
        }
        else {
            NSLog(@"Unable to get graphics context");
        }
        
        UIGraphicsEndImageContext();
        
        //    NSLog(@"img %.0f, %.0f", image.size.width, image.size.height);
        inImage = image.CGImage;
        
        // Create off screen bitmap context to draw the image into. Format ARGB is 4 bytes for each pixel: Alpa, Red, Green, Blue
        
        if (inImage != NULL) {
            cgctx = [self createARGBBitmapContextFromImage:inImage];
        }
        else {
            NSLog(@"NULL inImage!");
        }
        
        if (cgctx == NULL) {
            /* error */
            NSLog(@"error!!");
            return;
        }

        size_t wFrame = CGImageGetWidth(inImage);
        size_t hFrame = CGImageGetHeight(inImage);

        CGRect rect = {{0,0},{wFrame, hFrame}};
        
        
        // Draw the image to the bitmap context. Once we draw, the memory
        // allocated for the context for rendering will then contain the
        // raw image data in the specified color space.
        CGContextDrawImage(cgctx, rect, inImage);
        
        // Now we can get a pointer to the image data associated with the bitmap
        // context.
        frameData = CGBitmapContextGetData(cgctx);
////////////////
        
        BOOL firstCol = YES;
        
//        NSMutableArray *cols = [NSMutableArray arrayWithCapacity:WIDTH];
        bitmap = [NSMutableString stringWithString:@"["];

        for (int col=0; col < WIDTH; col++) {

            if (firstCol) {
                firstCol = NO;
            }
            else {
                [bitmap appendString:@","];
            }
            
            [bitmap appendString:@"["];
            
//            NSMutableArray *colColors = [NSMutableArray arrayWithCapacity:HEIGHT];
//            NSMutableString *strColColors = [NSMutableString string];
            
            BOOL firstRow = YES;
            
            for (int row=0; row < HEIGHT; row++) {
                if (firstRow) {
                    firstRow = NO;
                }
                else {
                    [bitmap appendString:@","];
                }
                
                CGPoint point = CGPointMake(0 + (col * X_STEP),
                                            0 + (row * Y_STEP));
                
//                NSArray* color = nil;
                
                int red = 0;
                int green = 0;
                int blue = 0;
                
                if (frameData != NULL && sizeof(frameData) > 0) {
//                    NSLog(@"frameData size: %i", (int)sizeof(frameData));
                    
                    //offset locates the pixel in the data from x,y.
                    //4 for 4 bytes of data per pixel, w is width of one row of data.
                    int offset = 4*((wFrame*round(point.y))+round(point.x));
                    //        alpha =  _frameData[offset];
                    red = frameData[offset+1];
                    green = frameData[offset+2];
                    blue = frameData[offset+3];
                    
//                            NSLog(@"%.0f, %.0f: %i, %i, %i", point.x, point.y, red, green, blue);
                }
                
                
//                color = [NSArray arrayWithObjects:
//                         [NSString stringWithFormat:@"%i",red],
//                         [NSString stringWithFormat:@"%i",green],
//                         [NSString stringWithFormat:@"%i",blue],
//                         nil];
//                [colColors addObject:s];

//                [strColColors appendFormat:@"[%i,%i,%i]",red, green, blue];

                [bitmap appendFormat:@"[%i,%i,%i]",red, green, blue];
                
            }
            
//            [cols addObject:colColors];
            [bitmap appendString:@"]"];
//            [bitmap appendString:strColColors];
        }
        [bitmap appendString:@"]"];
    }
    @catch (NSException *exception) {
        NSLog(@"Error: %@", exception);
    }
    
    [self frameCaptureComplete:bitmap];

//    CGImageRelease(inImage);
    CGContextRelease(cgctx);

    if (frameData != NULL) {
//        free(frameData);
        frameData = NULL;
    }
    
=======
    CaptureAndSendBitmapOperation *op = [[CaptureAndSendBitmapOperation alloc] init];
    op.delegate = self;
    op.view = self.streamedContentArea;
    op.left = _left;
    op.top = _top;

    [_opQueue addOperation:op];
    
    
>>>>>>> 16750a0899500cbfe690fdd425778a06c9a8b235
}

- (NSString*)jsonStringify:(id)object error:(NSError**)err
{
    if (!object)
    {
        return nil;
    }
    
    NSString *string = nil;
    NSData *data = [NSJSONSerialization dataWithJSONObject:object options:0 error:err];
    
    if (data)
    {
        string = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
    }
    
    return string;
}
/*
- (UIImage*) imageWithView:(UIView *)view
{
    UIImage *img = nil;
    UIGraphicsBeginImageContext(view.bounds.size);
//    UIGraphicsBeginImageContextWithOptions(view.bounds.size, YES, 1.0);
    
    CGContextRef ctxt = UIGraphicsGetCurrentContext();
    
    if (ctxt != NULL) {
        
        [view.layer renderInContext:ctxt];
        img = UIGraphicsGetImageFromCurrentImageContext();
    }
    
    UIGraphicsEndImageContext();
    
    return img;
}
*/
/*
- (void)captureViewToFrameData
{
    // Free image data memory for the context
//    if (_frameData != NULL) {
//        free(_frameData);
//        _frameData = NULL;
//    }
    
    CGImageRef inImage;
    
//    UIImage *image = [self imageWithView:self.streamedContentArea];
    UIImage *image = nil;
    UIGraphicsBeginImageContext(self.streamedContentArea.bounds.size);
    CGContextRef ctxt = UIGraphicsGetCurrentContext();
    
    if (ctxt != NULL) {
        [self.streamedContentArea.layer renderInContext:ctxt];
        image = UIGraphicsGetImageFromCurrentImageContext();
    }
    else {
        NSLog(@"Unable to get graphics context");
    }
    
    UIGraphicsEndImageContext();
    
//    NSLog(@"img %.0f, %.0f", image.size.width, image.size.height);
    inImage = image.CGImage;
    
    // Create off screen bitmap context to draw the image into. Format ARGB is 4 bytes for each pixel: Alpa, Red, Green, Blue
    
    _cgctx = NULL;
    
    if (inImage != NULL) {
        _cgctx = [self createARGBBitmapContextFromImage:inImage];
    }
    else {
        NSLog(@"NULL inImage!");
    }
    
    if (_cgctx == NULL) {
        NSLog(@"error!!");
        _frameData = NULL;
        return;
    }
    
    _wFrame = CGImageGetWidth(inImage);
    _hFrame = CGImageGetHeight(inImage);
    CGRect rect = {{0,0},{_wFrame, _hFrame}};
    
    
    // Draw the image to the bitmap context. Once we draw, the memory
    // allocated for the context for rendering will then contain the
    // raw image data in the specified color space.
    CGContextDrawImage(_cgctx, rect, inImage);
    
    // Now we can get a pointer to the image data associated with the bitmap
    // context.
    _frameData = CGBitmapContextGetData(_cgctx);
    CGContextRelease(_cgctx);
}
*/

- (NSArray*) getPixelColorRGBNumberArrayAtLocation:(CGPoint)point {
    NSArray* color = nil;
    
    int red = 0;
    int green = 0;
    int blue = 0;
    
    if (_frameData != NULL) {
        //offset locates the pixel in the data from x,y.
        //4 for 4 bytes of data per pixel, w is width of one row of data.
        int offset = 4*((_wFrame*round(point.y))+round(point.x));
        //        alpha =  _frameData[offset];
        red = _frameData[offset+1];
        green = _frameData[offset+2];
        blue = _frameData[offset+3];
        
        //        NSLog(@"%.0f, %.0f: %i, %i, %i", point.x, point.y, red, green, blue);
    }
    
    color = [NSArray arrayWithObjects:
             [NSNumber numberWithInteger:red],
             [NSNumber numberWithInteger:green],
             [NSNumber numberWithInteger:blue],
             nil];
    
    return color;
}

- (CGContextRef) createARGBBitmapContextFromImage:(CGImageRef)inImage
{
    CGContextRef    context = NULL;
    CGColorSpaceRef colorSpace;
//    void *          bitmapData;
    int             bitmapByteCount;
    int             bitmapBytesPerRow;
    
    // Get image width, height. We'll use the entire image.
    size_t pixelsWide = CGImageGetWidth(inImage);
    size_t pixelsHigh = CGImageGetHeight(inImage);
    
    // Declare the number of bytes per row. Each pixel in the bitmap in this
    // example is represented by 4 bytes; 8 bits each of red, green, blue, and
    // alpha.
    bitmapBytesPerRow   = (pixelsWide * 4);
    bitmapByteCount     = (bitmapBytesPerRow * pixelsHigh);
    
    // Use the generic RGB color space.
    colorSpace = CGColorSpaceCreateDeviceRGB();
    
    if (colorSpace == NULL)
    {
        fprintf(stderr, "Error allocating color space\n");
        return NULL;
    }
    
    // Allocate memory for image data. This is the destination in memory
    // where any drawing to the bitmap context will be rendered.
//    bitmapData = malloc( bitmapByteCount );
//    if (bitmapData == NULL)
//    {
//        fprintf (stderr, "Memory not allocated!");
//        CGColorSpaceRelease( colorSpace );
//        return NULL;
//    }
    
    // Create the bitmap context. We want pre-multiplied ARGB, 8-bits
    // per component. Regardless of what the source image format is
    // (CMYK, Grayscale, and so on) it will be converted over to the format
    // specified here by CGBitmapContextCreate.
    context = CGBitmapContextCreateWithData(NULL,
                                            pixelsWide,
                                            pixelsHigh,
                                            8,
                                            bitmapBytesPerRow,
                                            colorSpace,
                                            kCGImageAlphaNoneSkipFirst,
                                            bitmapContextReleaseCallback, NULL);
//    context = CGBitmapContextCreate (NULL,
//                                     pixelsWide,
//                                     pixelsHigh,
//                                     8,      // bits per component
//                                     bitmapBytesPerRow,
//                                     colorSpace,
//                                     kCGImageAlphaNoneSkipFirst);
    
    if (context == NULL)
    {
//        free (bitmapData);
        fprintf (stderr, "Context not created!");
    }
    
    // Make sure and release colorspace before returning
    CGColorSpaceRelease( colorSpace );
    
    return context;
}

///////////////

@end
